use std::fmt::{Debug, Formatter};
use std::{error, fmt};

pub type ByteReaderResult<T> = Result<T, ByteReaderError>;

#[expect(clippy::module_name_repetitions)]
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ByteReaderError {
    NotEnoughBytes {
        index_offset: usize,
        buffer_length: usize,
    },
    SliceConversionFailure,
    InvalidUtf8,
}

impl error::Error for ByteReaderError {}

impl fmt::Display for ByteReaderError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            ByteReaderError::NotEnoughBytes {
                index_offset,
                buffer_length,
            } => write!(
                f,
                "Attempted to read past the end of the buffer. Index Offset: '{index_offset}', Buffer Length: '{buffer_length}'.",
            ),
            ByteReaderError::SliceConversionFailure => write!(
                f,
                "Failed to convert slice to a fixed-size array."
            ),
            ByteReaderError::InvalidUtf8 => write!(
                f,
                "Attempted to read invalid UTF-8 bytes."
            ),
        }
    }
}
