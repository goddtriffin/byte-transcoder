import { validate } from "@std/uuid";

/**
 * Reads bytes from a Uint8Array.
 */
export default class ByteReader {
  private data: Uint8Array;
  private position: number;

  /**
   * Wraps a Uint8Array to read from.
   */
  constructor(data: Uint8Array) {
    this.data = data;
    this.position = 0;
  }

  /**
   * Reads the next byte as an unsigned 8-bit integer.
   */
  public readU8(): number {
    if (this.position >= this.data.length) {
      throw new Error("End of buffer");
    }

    return this.data[this.position++];
  }

  /**
   * Reads the next two bytes as a little-endian unsigned 16-bit integer.
   */
  public readU16(): number {
    if (this.position + 2 > this.data.length) {
      throw new Error("Not enough bytes to read u16");
    }

    const value: number = this.data[this.position] | (this.data[this.position + 1] << 8);
    this.position += 2;
    return value;
  }

  /**
   * Reads the next four bytes as an unsigned 32-bit integer.
   */
  public readU32(): number {
    if (this.position + 4 > this.data.length) {
      throw new Error("Not enough bytes to read u32");
    }

    const value: number = this.data[this.position] |
      (this.data[this.position + 1] << 8) |
      (this.data[this.position + 2] << 16) |
      (this.data[this.position + 3] << 24);
    this.position += 4;
    return value >>> 0; // Convert to unsigned 32-bit integer
  }

  /**
   * Reads the next eight bytes as a little-endian unsigned 64-bit integer.
   */
  public readU64(): bigint {
    if (this.position + 8 > this.data.length) {
      throw new Error("Not enough bytes to read u64");
    }

    const low: bigint = BigInt(this.readU32());
    const high: bigint = BigInt(this.readU32());
    return (high << 32n) | low;
  }

  /**
   * Reads the next byte as an unsigned 8-bit integer to determine the length of the string,
   * then reads that many bytes as a UTF-8 string.
   */
  public readString(): string {
    const length = this.readU8();
    if (this.position + length > this.data.length) {
      throw new Error("Not enough bytes to read string");
    }

    const stringBytes: Uint8Array = this.data.slice(this.position, this.position + length);
    this.position += length;
    return new TextDecoder().decode(stringBytes);
  }

  /**
   * Reads the next sixteen bytes as a UUID.
   */
  public readUuid(): string {
    if (this.position + 16 > this.data.length) {
      throw new Error("Not enough bytes to read UUID");
    }

    const uuidBytes: Uint8Array = this.data.slice(this.position, this.position + 16);
    this.position += 16;

    const hex: string = Array.from(uuidBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    const uuid: string = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${
      hex.slice(20)
    }`;

    if (!validate(uuid)) {
      throw new Error(`Invalid UUID: '${uuid}'`);
    }

    return uuid;
  }

  /**
   * Reads the remaining bytes in the buffer.
   */
  public readRemainingBytes(): Uint8Array {
    const remaining: Uint8Array = this.data.slice(this.position);
    this.position = this.data.length;
    return remaining;
  }

  /**
   * Whether the buffer is empty.
   */
  public isEmpty(): boolean {
    return this.position >= this.data.length;
  }

  /**
   * The number of bytes remaining in the buffer.
   */
  public remaining(): number {
    return this.data.length - this.position;
  }
}
