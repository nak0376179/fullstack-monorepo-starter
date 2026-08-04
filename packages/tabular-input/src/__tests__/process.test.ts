import { describe, expect, it } from "vitest";
import { processTable } from "../process";
import { toCsv, toJson } from "../serialize";
import type { TableSchema } from "../types";
import { charset, email, maxLength } from "../validators";

const schema: TableSchema = [
  { key: "name", label: "氏名", required: true, validators: [maxLength(10)] },
  { key: "email", label: "メールアドレス", required: true, validators: [email()] },
  { key: "age", label: "年齢", required: false, validators: [charset("digits")] },
];

describe("processTable", () => {
  it("CSV を正常に処理する", () => {
    const result = processTable("name,email,age\n山田,a@example.com,30", schema);
    expect(result.ok).toBe(true);
    expect(result.delimiter).toBe(",");
    expect(result.records).toEqual([{ name: "山田", email: "a@example.com", age: "30" }]);
  });

  it("TSV を自動判定して処理する", () => {
    const result = processTable("name\temail\n山田\ta@example.com", schema);
    expect(result.ok).toBe(true);
    expect(result.delimiter).toBe("\t");
    expect(result.records).toEqual([{ name: "山田", email: "a@example.com" }]);
  });

  it("ヘッダはラベル名でも受け付ける", () => {
    const result = processTable("氏名,メールアドレス\n山田,a@example.com", schema);
    expect(result.ok).toBe(true);
    expect(result.records[0]).toEqual({ name: "山田", email: "a@example.com" });
  });

  it("入力が空ならエラー", () => {
    const result = processTable("  \n ", schema);
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.message).toBe("入力が空です");
  });

  it("必須カラムがヘッダにないとエラー", () => {
    const result = processTable("name,age\n山田,30", schema);
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.message).toContain("必須カラム");
    expect(result.errors[0]?.message).toContain("メールアドレス");
  });

  it("不明なカラムはエラー", () => {
    const result = processTable("name,email,unknown\n山田,a@example.com,x", schema);
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.message).toContain('不明なカラム "unknown"');
  });

  it("必須項目の空欄とバリデーション違反を行番号つきで報告する", () => {
    const text = ["name,email,age", ",bad-address,abc", "山田,a@example.com,30"].join("\n");
    const result = processTable(text, schema);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      { row: 2, field: "name", message: "氏名は必須です" },
      { row: 2, field: "email", message: "メールアドレスがメールアドレスの形式ではありません" },
      { row: 2, field: "age", message: "年齢は半角数字で入力してください" },
    ]);
  });

  it("カラム数がヘッダと違う行はエラーにする", () => {
    const result = processTable("name,email\n山田,a@example.com,余分", schema);
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.message).toContain("カラム数がヘッダと一致しません");
  });

  it("エラーは既定で 10 件までに制限され、総数は別途返す", () => {
    const lines = ["name,email"];
    for (let i = 0; i < 12; i += 1) lines.push(",bad");
    const result = processTable(lines.join("\n"), schema);
    expect(result.errors).toHaveLength(10);
    expect(result.totalErrorCount).toBe(24); // 必須空欄 + メール形式 × 12 行
  });
});

describe("serialize", () => {
  it("toJson はスキーマ順のキーで出力し、存在しないカラムは省略する", () => {
    const result = processTable("email,name\na@example.com,山田", schema);
    const json = toJson(result.records, schema, 0);
    expect(json).toBe('[{"name":"山田","email":"a@example.com"}]');
  });

  it("toCsv は全カラムをスキーマ順で出力し、必要なセルをクォートする", () => {
    const result = processTable('name,email\n"山田, 太郎",a@example.com', schema);
    const csv = toCsv(result.records, schema);
    expect(csv).toBe('name,email,age\n"山田, 太郎",a@example.com,');
  });
});
