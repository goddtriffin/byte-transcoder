import { assert, assertEquals } from "@std/assert";
import ByteWriter from "./byte-writer.ts";
import ByteReader from "./byte-reader.ts";

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

Deno.test("u8: success", () => {
  const expected: number = 69;

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeU8(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u8"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: number = byteReader.readU8();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u16: success", () => {
  const expected: number = 0xBEEF;

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeU16(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u16"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: number = byteReader.readU16();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u32: success", () => {
  const expected: number = 0xDEADBEEF;

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeU32(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u32"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: number = byteReader.readU32();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("u64: success", () => {
  const expected: bigint = 0x0123_4567_89AB_CDEFn;

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeU64(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("u64"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: bigint = byteReader.readU64();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("string: success", () => {
  const expected: string = "Todd";

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeString(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("string"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: string = byteReader.readString();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});

Deno.test("uuid: success", () => {
  const expected: string = "1a9f446b-9f74-413c-882c-f6d8344c401e";

  const byteWriter: ByteWriter = new ByteWriter();
  byteWriter.writeUuid(expected);
  const bytes: Uint8Array = byteWriter.getBytes();
  assertEquals(bytes, getTestCaseBytes("uuid"));

  const byteReader: ByteReader = new ByteReader(bytes);
  const actual: string = byteReader.readUuid();
  assertEquals(actual, expected);
  assert(byteReader.isEmpty());
});
