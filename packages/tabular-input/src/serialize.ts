import type { Delimiter, TableRecord, TableSchema } from "./types";

/**
 * レコードを JSON 文字列に変換する。キーはスキーマの定義順。
 * 入力にカラムが存在しなかった項目(undefined)は出力に含めない。
 */
export function toJson(records: readonly TableRecord[], schema: TableSchema, indent = 2): string {
  const objects = records.map((record) => {
    const obj: Record<string, string> = {};
    for (const field of schema) {
      const value = record[field.key];
      if (value !== undefined) obj[field.key] = value;
    }
    return obj;
  });
  return JSON.stringify(objects, null, indent);
}

/**
 * レコードを CSV 文字列に変換する。カラムはスキーマの定義順で全項目を出力し、
 * 値が存在しない項目は空欄になる。必要なセルは RFC 4180 に従いクォートする。
 */
export function toCsv(
  records: readonly TableRecord[],
  schema: TableSchema,
  delimiter: Delimiter = ",",
): string {
  const escape = (value: string): string =>
    value.includes(delimiter) || /["\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

  const lines = [schema.map((f) => escape(f.key)).join(delimiter)];
  for (const record of records) {
    lines.push(schema.map((f) => escape(record[f.key] ?? "")).join(delimiter));
  }
  return lines.join("\n");
}
