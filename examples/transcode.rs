use byte_transcoder::{reader::ByteReader, reader_error::ByteReaderResult};
use uuid::Uuid;

#[allow(dead_code)]
#[derive(Debug)]
pub struct Payload {
    game_id: Uuid,
    join_code: String,
    lobby: Vec<Account>,
}

#[derive(Debug)]
pub struct Account {
    pub account_id: Uuid,
    pub username: String,
}

fn main() -> ByteReaderResult<()> {
    #[rustfmt::skip]
    let bytes: Vec<u8> = vec![
        // Game ID (UUIDv4)
        26, 159, 68, 107, 159, 116, 65, 60, 136, 44, 246, 216, 52, 76, 64, 30,

        // Join Code (String)
        4, 84, 111, 100, 100,

        // Lobby size (u8)
        2,

        // Account 1
        // (UUIDv4)
        26, 159, 68, 107, 159, 116, 65, 60, 136, 44, 246, 216, 52, 76, 64, 30,
        // (String)
        4, 84, 111, 100, 100,

        // Account 2
        // (UUIDv4)
        26, 159, 68, 107, 159, 116, 65, 60, 136, 44, 246, 216, 52, 76, 64, 30,
        // (String)
        4, 84, 111, 100, 100,
    ];

    let mut byte_reader: ByteReader = ByteReader::new(&bytes);

    let game_id: Uuid = byte_reader.read_uuid()?;
    let join_code: String = byte_reader.read_string()?;

    let mut lobby: Vec<Account> = Vec::new();
    let lobby_len: u8 = byte_reader.read_u8()?;
    for _ in 0..lobby_len {
        lobby.push(Account {
            account_id: byte_reader.read_uuid()?,
            username: byte_reader.read_string()?,
        });
    }

    println!(
        "{:?}",
        Payload {
            game_id,
            join_code,
            lobby,
        }
    );
    Ok(())
}
