import { assert, assertEquals, assertThrows } from "@std/assert";
import { ByteWriter } from "./byte-writer.ts";
import { ByteReader } from "./byte-reader.ts";
import { Endian } from "./endian.ts";

function getTestCaseBytes(filename: string): Uint8Array {
  const path: string = `${Deno.cwd()}/test-cases/${filename}`;
  const fileContent = Deno.readTextFileSync(path);

  const numbers: number[] = fileContent.trim().split(" ").map((s) => {
    const num: number = parseInt(s, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      throw new Error(`Invalid byte value '${s}' in file: ${path}`);
    }
    return num;
  });

  return new Uint8Array(numbers);
}

Deno.test("u8_le: success", () => {
  const expected: number = 69;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeU8(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u8_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readU8();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u8_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeU8(-1), Error, "Invalid u8 value");
  assertThrows(() => byteWriter.writeU8(256), Error, "Invalid u8 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([]), Endian.Little);
  assertThrows(() => byteReader.readU8(), Error, "End of buffer");
});

Deno.test("u8_be: success", () => {
  const expected: number = 69;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeU8(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u8_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readU8();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i8_le: success", () => {
  const expected: number = -1;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeI8(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i8_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readI8();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i8_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeI8(-129), Error, "Invalid i8 value");
  assertThrows(() => byteWriter.writeI8(128), Error, "Invalid i8 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([]), Endian.Little);
  assertThrows(() => byteReader.readI8(), Error, "End of buffer");
});

Deno.test("i8_be: success", () => {
  const expected: number = -1;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeI8(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i8_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readI8();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u16_le: success", () => {
  const expected: number = 0xBEEF;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeU16(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u16_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readU16();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u16_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeU16(-1), Error, "Invalid u16 value");
  assertThrows(() => byteWriter.writeU16(65536), Error, "Invalid u16 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([0x01]), Endian.Little);
  assertThrows(() => byteReader.readU16(), Error, "Not enough bytes to read u16");
});

Deno.test("u16_be: success", () => {
  const expected: number = 0xBEEF;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeU16(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u16_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readU16();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i16_le: success", () => {
  const expected: number = -16657;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeI16(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i16_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readI16();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i16_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeI16(-32769), Error, "Invalid i16 value");
  assertThrows(() => byteWriter.writeI16(32768), Error, "Invalid i16 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([0x01]), Endian.Little);
  assertThrows(() => byteReader.readI16(), Error, "Not enough bytes to read i16");
});

Deno.test("i16_be: success", () => {
  const expected: number = -16657;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeI16(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i16_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readI16();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u32_le: success", () => {
  const expected: number = 0xDEADBEEF;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeU32(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u32_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readU32();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u32_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeU32(-1), Error, "Invalid u32 value");
  assertThrows(() => byteWriter.writeU32(4294967296), Error, "Invalid u32 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([0x01, 0x02, 0x03]), Endian.Little);
  assertThrows(() => byteReader.readU32(), Error, "Not enough bytes to read u32");
});

Deno.test("u32_be: success", () => {
  const expected: number = 0xDEADBEEF;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeU32(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u32_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readU32();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i32_le: success", () => {
  const expected: number = -559_038_737;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeI32(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i32_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: number = byteReader.readI32();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i32_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeI32(-2147483649), Error, "Invalid i32 value");
  assertThrows(() => byteWriter.writeI32(2147483648), Error, "Invalid i32 value");

  const byteReader: ByteReader = new ByteReader(new Uint8Array([0x01, 0x02, 0x03]), Endian.Little);
  assertThrows(() => byteReader.readI32(), Error, "Not enough bytes to read i32");
});

Deno.test("i32_be: success", () => {
  const expected: number = -559_038_737;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeI32(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i32_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: number = byteReader.readI32();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u64_le: success", () => {
  const expected: bigint = 0x0123_4567_89AB_CDEFn;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeU64(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u64_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: bigint = byteReader.readU64();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u64_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeU64(-1n), Error, "Invalid u64 value");
  assertThrows(() => byteWriter.writeU64(18446744073709551616n), Error, "Invalid u64 value");

  const byteReader: ByteReader = new ByteReader(
    new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
    Endian.Little,
  );
  assertThrows(() => byteReader.readU64(), Error, "Not enough bytes to read u64");
});

Deno.test("u64_be: success", () => {
  const expected: bigint = 0x0123_4567_89AB_CDEFn;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeU64(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u64_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: bigint = byteReader.readU64();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i64_le: success", () => {
  const expected: bigint = -81_985_529_216_486_895n;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeI64(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i64_le"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: bigint = byteReader.readI64();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("i64_le: failure", () => {
  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  assertThrows(() => byteWriter.writeI64(-9223372036854775809n), Error, "Invalid i64 value");
  assertThrows(() => byteWriter.writeI64(9223372036854775808n), Error, "Invalid i64 value");

  const byteReader: ByteReader = new ByteReader(
    new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
    Endian.Little,
  );
  assertThrows(() => byteReader.readI64(), Error, "Not enough bytes to read i64");
});

Deno.test("i64_be: success", () => {
  const expected: bigint = -81_985_529_216_486_895n;

  const byteWriter: ByteWriter = new ByteWriter(Endian.Big);
  byteWriter.writeI64(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("i64_be"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Big);
  const actual: bigint = byteReader.readI64();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("string: success", () => {
  const expected: string = "Todd";

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeString(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("string"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: string = byteReader.readString();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("string: failure", () => {
  const byteReader: ByteReader = new ByteReader(new Uint8Array([0x05, 0x54, 0x6F, 0x64]), Endian.Little);
  assertThrows(() => byteReader.readString(), Error, "Not enough bytes to read string");
});

Deno.test("uuid: success", () => {
  const expected: string = "1a9f446b-9f74-413c-882c-f6d8344c401e";

  const byteWriter: ByteWriter = new ByteWriter(Endian.Little);
  byteWriter.writeUuid(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("uuid"));

  const byteReader: ByteReader = new ByteReader(bytes, Endian.Little);
  const actual: string = byteReader.readUuid();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("uuid: failure", () => {
  const byteReader: ByteReader = new ByteReader(
    new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F]),
    Endian.Little,
  );
  assertThrows(() => byteReader.readUuid(), Error, "Not enough bytes to read UUID");
});
