# byte-transcoder-rs

[![Version](https://img.shields.io/crates/v/byte-transcoder-rs)](https://crates.io/crates/byte-transcoder-rs)
[![Docs](https://docs.rs/byte-transcoder-rs/badge.svg)](https://docs.rs/byte-transcoder-rs)
[![License](https://img.shields.io/crates/l/byte-transcoder-rs)](https://crates.io/crates/byte-transcoder-rs)

A Rust library to transcode higher-level data types to/from bytes.

## Features

### ByteReader

Wraps a byte slice and exposes easy-to-use retrieval functions for primitives
(e.g. `u8`/`u16`/`u32`/`u64`, `String`, `Uuid`, etc).

## Examples

Read `tests/` to learn how to use!

## Developers

**Project is under active maintenance - even if there are no recent commits!
Please submit an issue / bug request if the library needs updating for any
reason!**

### Feature Requests

#### Support for more datatypes

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

`byte-transcoder-rs` is open source under the
[MIT License](https://github.com/goddtriffin/byte-transcoder-rs/blob/main/LICENSE).
