use byte_transcoder::{reader::ByteReader, reader_error::ByteReaderError};
use uuid::Uuid;

#[test]
fn test_read_u8_success() {
    let data: Vec<u8> = vec![42];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.read_u8().unwrap(), 42);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u8_not_enough_bytes() {
    let data: Vec<u8> = vec![];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_u8().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u16_success() {
    let data: Vec<u8> = vec![0xEF, 0xBE];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.read_u16().unwrap(), 0xBEEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u16_not_enough_bytes() {
    let data: Vec<u8> = vec![0xEF];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_u16().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u32_success() {
    let data: Vec<u8> = vec![0xEF, 0xBE, 0xAD, 0xDE];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.read_u32().unwrap(), 0xDEAD_BEEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u32_not_enough_bytes() {
    let data: Vec<u8> = vec![0xEF, 0xBE, 0xAD];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_u32().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u64_success() {
    let data: Vec<u8> = vec![0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.read_u64().unwrap(), 0x0123_4567_89AB_CDEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u64_not_enough_bytes() {
    let data: Vec<u8> = vec![0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_u64().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_string_success() {
    let data: Vec<u8> = vec![5, b'H', b'e', b'l', b'l', b'o'];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.read_string().unwrap(), "Hello");
    assert!(reader.is_empty());
}

#[test]
fn test_read_string_not_enough_bytes() {
    let data: Vec<u8> = vec![5, b'H', b'e', b'l'];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_string().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_string_invalid_utf8() {
    let data: Vec<u8> = vec![3, 0xFF, 0xFF, 0xFF];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_string().unwrap_err(),
        ByteReaderError::InvalidUtf8
    ));
}

#[test]
fn test_read_uuid_success() {
    let uuid_bytes: [u8; 16] = [
        0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
        0x88,
    ];
    let data: Vec<u8> = uuid_bytes.to_vec();
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    let expected_uuid: uuid::Uuid = Uuid::from_bytes(uuid_bytes);
    assert_eq!(reader.read_uuid().unwrap(), expected_uuid);
    assert!(reader.is_empty());
}

#[test]
fn test_read_uuid_not_enough_bytes() {
    let data: Vec<u8> = vec![0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert!(matches!(
        reader.read_uuid().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_remaining_bytes() {
    let data: Vec<u8> = vec![1, 2, 3, 4, 5];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    reader.read_u8().unwrap();
    reader.read_u8().unwrap();
    assert_eq!(reader.read_remaining_bytes(), vec![3, 4, 5]);
    assert!(reader.is_empty());
}

#[test]
fn test_remaining() {
    let data: Vec<u8> = vec![1, 2, 3, 4, 5];
    let mut reader: ByteReader<'_> = ByteReader::new(&data);
    assert_eq!(reader.remaining(), 5);
    reader.read_u8().unwrap();
    reader.read_u16().unwrap();
    assert_eq!(reader.remaining(), 2);
}
