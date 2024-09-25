use std::{
    fs::File,
    io::{BufRead, BufReader},
    path::PathBuf,
    str::FromStr,
};

use byte_transcoder::{reader::ByteReader, reader_error::ByteReaderError};
use uuid::Uuid;

/// # Panics
///
/// Panics if the file does not exist, is empty, or if a line cannot be read from the file.
#[must_use]
pub fn get_payload_bytes(filename: &str) -> Vec<u8> {
    let mut path: PathBuf = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    path.push("test-cases");
    path.push(filename);

    let file: File = File::open(&path).unwrap_or_else(|_| panic!("Failed to open file: {path:?}"));
    let reader: BufReader<File> = BufReader::new(file);
    let line: String = reader
        .lines()
        .next()
        .unwrap_or_else(|| panic!("File is empty: {path:?}"))
        .unwrap_or_else(|_| panic!("Failed to read line from file: {path:?}"));

    line.split(' ')
        .map(|s| {
            s.trim()
                .parse()
                .unwrap_or_else(|_| panic!("Failed to parse '{s}' as u8 in file: {path:?}"))
        })
        .collect()
}

#[test]
fn test_read_u8_success() {
    let expected: Vec<u8> = get_payload_bytes("u8");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.read_u8().unwrap(), 69);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u8_not_enough_bytes() {
    let expected: Vec<u8> = vec![];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_u8().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u16_success() {
    let expected: Vec<u8> = get_payload_bytes("u16");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.read_u16().unwrap(), 0xBEEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u16_not_enough_bytes() {
    let expected: Vec<u8> = vec![0xEF];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_u16().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u32_success() {
    let expected: Vec<u8> = get_payload_bytes("u32");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.read_u32().unwrap(), 0xDEAD_BEEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u32_not_enough_bytes() {
    let expected: Vec<u8> = vec![0xEF, 0xBE, 0xAD];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_u32().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_u64_success() {
    let expected: Vec<u8> = get_payload_bytes("u64");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.read_u64().unwrap(), 0x0123_4567_89AB_CDEF);
    assert!(reader.is_empty());
}

#[test]
fn test_read_u64_not_enough_bytes() {
    let expected: Vec<u8> = vec![0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_u64().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_string_success() {
    let expected: Vec<u8> = get_payload_bytes("string");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.read_string().unwrap().as_bytes(), "Todd".as_bytes());
    assert!(reader.is_empty());
}

#[test]
fn test_read_string_not_enough_bytes() {
    let expected: Vec<u8> = vec![5, b'V', b'a', b'l'];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_string().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_string_invalid_utf8() {
    let expected: Vec<u8> = vec![3, 0xFF, 0xFF, 0xFF];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_string().unwrap_err(),
        ByteReaderError::InvalidUtf8
    ));
}

#[test]
fn test_read_uuid_success() {
    let expected: Vec<u8> = get_payload_bytes("uuid");
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(
        reader.read_uuid().unwrap().as_bytes(),
        Uuid::from_str("1a9f446b-9f74-413c-882c-f6d8344c401e")
            .unwrap()
            .as_bytes()
    );
    assert!(reader.is_empty());
}

#[test]
fn test_read_uuid_not_enough_bytes() {
    let expected: Vec<u8> = vec![0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert!(matches!(
        reader.read_uuid().unwrap_err(),
        ByteReaderError::NotEnoughBytes { .. }
    ));
}

#[test]
fn test_read_remaining_bytes() {
    let expected: Vec<u8> = vec![1, 2, 3, 4, 5];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    reader.read_u8().unwrap();
    reader.read_u8().unwrap();
    assert_eq!(reader.read_remaining_bytes(), vec![3, 4, 5]);
    assert!(reader.is_empty());
}

#[test]
fn test_remaining() {
    let expected: Vec<u8> = vec![1, 2, 3, 4, 5];
    let mut reader: ByteReader<'_> = ByteReader::new(&expected);
    assert_eq!(reader.remaining(), 5);
    reader.read_u8().unwrap();
    reader.read_u16().unwrap();
    assert_eq!(reader.remaining(), 2);
}
