use std::convert::TryInto;
use uuid::Uuid;

use crate::reader_error::{ByteReaderError, ByteReaderResult};

#[expect(clippy::module_name_repetitions)]
pub struct ByteReader<'a> {
    data: &'a [u8],
    index: usize,
}

impl<'a> ByteReader<'a> {
    #[must_use]
    pub fn new(data: &'a [u8]) -> Self {
        ByteReader { data, index: 0 }
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read.
    pub fn read_u8(&mut self) -> ByteReaderResult<u8> {
        if self.index >= self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset: self.index,
                buffer_length: self.data.len(),
            });
        }

        let value: u8 = self.data[self.index];
        self.index += 1;
        Ok(value)
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read.
    pub fn read_u16(&mut self) -> ByteReaderResult<u16> {
        let index_offset: usize = self.index + 2;
        if index_offset > self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length: self.data.len(),
            });
        }

        let u16_bytes: [u8; 2] = self.data[self.index..index_offset]
            .try_into()
            .map_err(|_| ByteReaderError::SliceConversionFailure)?;
        let value: u16 = u16::from_le_bytes(u16_bytes);
        self.index = index_offset;
        Ok(value)
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read.
    pub fn read_u32(&mut self) -> ByteReaderResult<u32> {
        let index_offset: usize = self.index + 4;
        if index_offset > self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length: self.data.len(),
            });
        }

        let u32_bytes: [u8; 4] = self.data[self.index..index_offset]
            .try_into()
            .map_err(|_| ByteReaderError::SliceConversionFailure)?;
        let value: u32 = u32::from_le_bytes(u32_bytes);
        self.index = index_offset;
        Ok(value)
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read.
    pub fn read_u64(&mut self) -> ByteReaderResult<u64> {
        let index_offset: usize = self.index + 8;
        if index_offset > self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length: self.data.len(),
            });
        }

        let u64_bytes: [u8; 8] = self.data[self.index..index_offset]
            .try_into()
            .map_err(|_| ByteReaderError::SliceConversionFailure)?;
        let value: u64 = u64::from_le_bytes(u64_bytes);
        self.index = index_offset;
        Ok(value)
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read or if the UTF-8 bytes are invalid.
    pub fn read_string(&mut self) -> ByteReaderResult<String> {
        let length: usize = self.read_u8()? as usize;
        let index_offset: usize = self.index + length;
        if index_offset > self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length: self.data.len(),
            });
        }

        let string_bytes: &[u8] = &self.data[self.index..index_offset];
        self.index = index_offset;
        String::from_utf8(string_bytes.to_vec()).map_err(|_| ByteReaderError::InvalidUtf8)
    }

    /// # Errors
    ///
    /// Will return an error if there are not enough bytes to read or if the UUID bytes are invalid.
    pub fn read_uuid(&mut self) -> ByteReaderResult<Uuid> {
        let index_offset: usize = self.index + 16;
        if index_offset > self.data.len() {
            return Err(ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length: self.data.len(),
            });
        }

        let uuid_bytes: [u8; 16] = self.data[self.index..index_offset]
            .try_into()
            .map_err(|_| ByteReaderError::SliceConversionFailure)?;
        self.index = index_offset;
        Ok(Uuid::from_bytes(uuid_bytes))
    }

    #[must_use]
    pub fn read_remaining_bytes(&mut self) -> Vec<u8> {
        let remaining: Vec<u8> = self.data[self.index..].to_vec();
        self.index = self.data.len(); // Move the position to the end
        remaining
    }

    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.index >= self.data.len()
    }

    #[must_use]
    pub fn remaining(&self) -> usize {
        self.data.len() - self.index
    }
}
