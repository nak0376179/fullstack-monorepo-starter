import type { TableSchema } from "./types";
import { charset, email, maxLength, pattern } from "./validators";

/**
 * サンプル用のユーザー取り込みスキーマ。
 * 定義順がそのまま出力(JSON のキー順・CSV のカラム順)になる。
 */
export const userImportSchema: TableSchema = [
  { key: "name", label: "氏名", required: true, validators: [maxLength(50)] },
  {
    key: "kana",
    label: "フリガナ",
    required: false,
    validators: [charset("katakana"), maxLength(50)],
  },
  {
    key: "email",
    label: "メールアドレス",
    required: true,
    validators: [email(), maxLength(254)],
  },
  {
    key: "age",
    label: "年齢",
    required: false,
    validators: [charset("digits"), maxLength(3)],
  },
  {
    key: "phone",
    label: "電話番号",
    required: false,
    validators: [pattern(/^[0-9-]+$/, "は半角数字とハイフンで入力してください"), maxLength(13)],
  },
  { key: "note", label: "備考", required: false, validators: [maxLength(100)] },
];

export const sampleCsvText = [
  "name,kana,email,age,phone,note",
  "山田 太郎,ヤマダ タロウ,taro@example.com,34,03-1234-5678,営業部",
  '佐藤 花子,サトウ ハナコ,hanako@example.com,28,,"引越し予定, 住所変更あり"',
  "鈴木 一郎,,ichiro@example.com,,090-1111-2222,",
].join("\n");

export const sampleTsvText = [
  "氏名\tフリガナ\tメールアドレス\t年齢",
  "山田 太郎\tヤマダ タロウ\ttaro@example.com\t34",
  "佐藤 花子\tサトウ ハナコ\thanako@example.com\t28",
].join("\n");

export const sampleInvalidCsvText = [
  "name,kana,email,age",
  ",やまだ たろう,taro-example.com,ex",
  "佐藤 花子,サトウ ハナコ,hanako@example.com,28",
].join("\n");
