import { validate } from "@std/uuid";

/**
 * Writes bytes to a Uint8Array.
 */
export default class ByteWriter {
  private bytes: number[];

  constructor() {
    this.bytes = [];
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
   * Writes an unsigned 16-bit integer as little-endian.
   */
  public writeU16(value: number): void {
    if (value < 0 || value > 65535) {
      throw new Error(`Invalid u16 value: '${value}'`);
    }

    this.bytes.push(value & 0xFF); // least significant byte
    this.bytes.push((value >> 8) & 0xFF); // most significant byte
  }

  /**
   * Writes an unsigned 32-bit integer as little-endian.
   */
  public writeU32(value: number): void {
    if (value < 0 || value > 4294967295) {
      throw new Error(`Invalid u32 value: '${value}'`);
    }

    this.bytes.push(value & 0xFF); // least significant byte
    this.bytes.push((value >> 8) & 0xFF);
    this.bytes.push((value >> 16) & 0xFF);
    this.bytes.push((value >> 24) & 0xFF); // most significant byte
  }

  /**
   * Writes an unsigned 64-bit integer as little-endian.
   */
  public writeU64(value: bigint): void {
    if (value < 0n || value > 18446744073709551615n) {
      throw new Error(`Invalid u64 value: '${value}'`);
    }

    const low: number = Number(value & 0xFFFFFFFFn); // least significant byte
    const high: number = Number(value >> 32n); // most significant byte

    this.writeU32(low);
    this.writeU32(high);
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
