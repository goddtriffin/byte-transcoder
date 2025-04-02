import { validate } from "@std/uuid";
import { Endian } from "./endian.ts";

/**
 * Writes bytes to a Uint8Array.
 */
export class ByteWriter {
  private bytes: number[];
  private endian: Endian;

  /**
   * Writes bytes to a Uint8Array.
   */
  constructor(endian: Endian) {
    this.bytes = [];
    this.endian = endian;
  }

  /**
   * Writes an unsigned 8-bit integer.
   */
  public writeU8(value: number): void {
    if (value < 0 || value > 255) {
      throw new Error(`Invalid u8 value: '${value}'`);
    }

    this.bytes.push(value);
  }

  /**
   * Writes a signed 8-bit integer.
   */
  public writeI8(value: number): void {
    if (value < -128 || value > 127) {
      throw new Error(`Invalid i8 value: '${value}'`);
    }

    this.bytes.push(value & 0xFF);
  }

  /**
   * Writes an unsigned 16-bit integer.
   */
  public writeU16(value: number): void {
    if (value < 0 || value > 65535) {
      throw new Error(`Invalid u16 value: '${value}'`);
    }

    const bytes: number[] = [value & 0xFF, (value >> 8) & 0xFF];
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes a signed 16-bit integer.
   */
  public writeI16(value: number): void {
    if (value < -32768 || value > 32767) {
      throw new Error(`Invalid i16 value: '${value}'`);
    }

    const bytes: number[] = [value & 0xFF, (value >> 8) & 0xFF];
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes an unsigned 32-bit integer.
   */
  public writeU32(value: number): void {
    if (value < 0 || value > 4294967295) {
      throw new Error(`Invalid u32 value: '${value}'`);
    }

    const bytes: number[] = [
      value & 0xFF,
      (value >> 8) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 24) & 0xFF,
    ];
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes a signed 32-bit integer.
   */
  public writeI32(value: number): void {
    if (value < -2147483648 || value > 2147483647) {
      throw new Error(`Invalid i32 value: '${value}'`);
    }

    const bytes: number[] = [
      value & 0xFF,
      (value >> 8) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 24) & 0xFF,
    ];
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes an unsigned 64-bit integer.
   */
  public writeU64(value: bigint): void {
    if (value < 0n || value > 18446744073709551615n) {
      throw new Error(`Invalid u64 value: '${value}'`);
    }

    const bytes: number[] = Array.from({ length: 8 }, (_, i) => Number((value >> BigInt(i * 8)) & 0xFFn));
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes a signed 64-bit integer.
   */
  public writeI64(value: bigint): void {
    if (value < -9223372036854775808n || value > 9223372036854775807n) {
      throw new Error(`Invalid i64 value: '${value}'`);
    }

    const bytes: number[] = Array.from(
      { length: 8 },
      (_: unknown, i: number) => Number((value >> BigInt(i * 8)) & 0xFFn),
    );
    this.bytes.push(...(this.endian === Endian.Little ? bytes : bytes.reverse()));
  }

  /**
   * Writes the length of the string as an unsigned 8-bit integer,
   * then writes the rest of the UTF-8 string's bytes.
   */
  public writeString(value: string): void {
    const stringBytes: Uint8Array = new TextEncoder().encode(value);
    if (stringBytes.length > 255) {
      throw new Error(`String too long: '${stringBytes.length}' bytes`);
    }

    this.writeU8(stringBytes.length);
    this.bytes.push(...stringBytes);
  }

  /**
   * Writes a UUID as 16 bytes.
   */
  public writeUuid(uuid: string): void {
    if (!validate(uuid)) {
      throw new Error(`Invalid UUID: '${uuid}'`);
    }

    const uuidBytes: Uint8Array = new Uint8Array(
      uuid.replace(/-/g, "").match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
    );
    this.bytes.push(...uuidBytes);
  }

  /**
   * Returns the written bytes as a Uint8Array.
   */
  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }
}
