# Byte Transcoder

[![Version](https://img.shields.io/crates/v/byte-transcoder)](https://crates.io/crates/byte-transcoder)
[![Docs](https://docs.rs/byte-transcoder/badge.svg)](https://docs.rs/byte-transcoder)

[![JSR](https://jsr.io/badges/@todd/byte-transcoder)](https://jsr.io/@todd/byte-transcoder)
[![JSR Score](https://jsr.io/badges/@todd/byte-transcoder/score)](https://jsr.io/@todd/byte-transcoder)

A Rust+Typescript library to transcode higher-level data types to/from bytes.

## Features

### ByteReader

Wraps a byte slice (`[u8]` in Rust, `Uint8Array` in Typescript) and exposes
easy-to-use retrieval functions for primitives (e.g. `u8`/`u16`/`u32`/`u64`,
`string`, `uuid`, etc).

### ByteWriter

Typescript only. Helps write `number`s as specific primitives (e.g. `u8`/`u16`/`u32`/`u64`, `string`, `uuid`, etc).

## Examples

Read `examples/`, `tests/`, and `src-ts/**/*.test.ts` for more examples!

### ByteReader

#### Typescript

```typescript
type Payload = { gameId: string; joinCode: string };

const bytes = new Uint8Array([
  // <your binary data>
]);
const byteReader = new ByteReader(bytes);

const payload: Payload = {
  gameId: byteReader.readUuid(),
  joinCode: byteReader.readString()
};
```

#### Rust

```rust
struct Payload {
    game_id: Uuid,
    join_code: String,
}

let bytes: Vec<u8> = vec![
  // <your binary data>
];
let mut byte_reader = ByteReader::new(bytes);

let payload = Payload {
  game_id: byte_reader.read_uuid()?,
  join_code: byte_reader.read_string()?,
}
```

### ByteWriter

#### Typescript

```typescript
type Payload = { gameId: string; joinCode: string };
const payload: Payload = {
  gameId: "24399a6c-c4a9-4053-9b2d-4199107fb567",
  joinCode: "12345"
};

const byteWriter = new ByteWriter();
byteWriter.writeUuid(payload.gameId);
byteWriter.writeString(payload.joinCode);

const bytes: Uint8Array = byteWriter.getBytes();
```

## Developers

**Project is under active maintenance - even if there are no recent commits!
Please submit an issue / bug request if the library needs updating for any
reason!**

### Feature Requests

#### Support more datatypes

I have only implemented the exact functions I need for the projects that I'm
currently building. If there is anything missing that you would like to see
implemented, please submit a PR! Or if you're lazy, submit a Feature Request and
I'll implement it lol

### Commands

- `make lint`
- `make test`
- `make fix`

## Credits

Made with 🤬 and 🥲 by [Todd Everett Griffin](https://www.toddgriffin.me/).
