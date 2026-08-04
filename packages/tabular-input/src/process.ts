import { detectDelimiter, parseDelimited } from "./parse";
import type {
  FieldDef,
  ProcessOptions,
  ProcessResult,
  TableRecord,
  TableSchema,
  ValidationError,
} from "./types";

export const DEFAULT_MAX_ERRORS = 10;

/**
 * ヘッダ付き CSV/TSV テキストをパースし、スキーマに従ってバリデーションする。
 * ヘッダのカラム名はフィールドの key・label のどちらでも受け付ける。
 * エラーは maxErrors 件(既定 10 件)まで errors に格納し、総数は totalErrorCount で返す。
 */
export function processTable(
  text: string,
  schema: TableSchema,
  options: ProcessOptions = {},
): ProcessResult {
  const maxErrors = options.maxErrors ?? DEFAULT_MAX_ERRORS;
  const delimiter =
    options.delimiter && options.delimiter !== "auto" ? options.delimiter : detectDelimiter(text);

  const errors: ValidationError[] = [];
  let totalErrorCount = 0;
  const addError = (error: ValidationError) => {
    totalErrorCount += 1;
    if (errors.length < maxErrors) errors.push(error);
  };
  const fail = (): ProcessResult => ({
    ok: false,
    records: [],
    errors,
    totalErrorCount,
    delimiter,
  });

  if (text.trim() === "") {
    addError({ row: null, field: null, message: "入力が空です" });
    return fail();
  }

  const rows = parseDelimited(text, delimiter);
  const headerCells = rows[0];
  if (!headerCells) {
    addError({ row: null, field: null, message: "ヘッダ行がありません" });
    return fail();
  }

  // ヘッダの各カラムをスキーマのフィールドに対応付ける(未知カラムは null)
  const columns: (FieldDef | null)[] = [];
  const seen = new Set<string>();
  headerCells.forEach((cell, index) => {
    const name = cell.trim();
    const field = schema.find((f) => f.key === name || f.label === name) ?? null;
    columns.push(field);
    if (!field) {
      addError({
        row: 1,
        field: null,
        message: `ヘッダ行: 不明なカラム "${name}"(${index + 1}列目)`,
      });
    } else if (seen.has(field.key)) {
      addError({
        row: 1,
        field: field.key,
        message: `ヘッダ行: カラム "${name}" が重複しています`,
      });
    } else {
      seen.add(field.key);
    }
  });
  for (const field of schema) {
    if (field.required && !seen.has(field.key)) {
      addError({
        row: 1,
        field: field.key,
        message: `ヘッダ行: 必須カラム "${field.label}(${field.key})" がありません`,
      });
    }
  }
  if (totalErrorCount > 0) return fail();

  const records: TableRecord[] = [];
  for (let r = 1; r < rows.length; r += 1) {
    const cells = rows[r] as string[];
    const rowNumber = r + 1;
    if (cells.length === 1 && cells[0]?.trim() === "") continue; // 空行はスキップ

    if (cells.length !== headerCells.length) {
      addError({
        row: rowNumber,
        field: null,
        message: `カラム数がヘッダと一致しません(期待 ${headerCells.length}、実際 ${cells.length})`,
      });
      continue;
    }

    const record: TableRecord = {};
    columns.forEach((field, c) => {
      if (!field) return;
      const value = (cells[c] ?? "").trim();
      record[field.key] = value;
      if (value === "") {
        if (field.required) {
          addError({
            row: rowNumber,
            field: field.key,
            message: `${field.label}は必須です`,
          });
        }
        return;
      }
      for (const validate of field.validators ?? []) {
        const message = validate(value, { field, row: rowNumber });
        if (message) {
          addError({ row: rowNumber, field: field.key, message });
          break;
        }
      }
    });
    records.push(record);
  }

  if (records.length === 0 && totalErrorCount === 0) {
    addError({ row: null, field: null, message: "データ行がありません" });
  }

  return {
    ok: totalErrorCount === 0,
    records,
    errors,
    totalErrorCount,
    delimiter,
  };
}
