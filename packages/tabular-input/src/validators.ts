import type { Validator } from "./types";

export const maxLength =
  (max: number): Validator =>
  (value, { field }) =>
    value.length > max ? `${field.label}は${max}文字以内で入力してください` : null;

export const minLength =
  (min: number): Validator =>
  (value, { field }) =>
    value.length < min ? `${field.label}は${min}文字以上で入力してください` : null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const email =
  (): Validator =>
  (value, { field }) =>
    EMAIL_RE.test(value) ? null : `${field.label}がメールアドレスの形式ではありません`;

// \s は全角スペース(U+3000)も含むため、姓名間の区切りを許容できる
const CHARSETS = {
  digits: { re: /^[0-9]+$/, name: "半角数字" },
  alphanumeric: { re: /^[A-Za-z0-9]+$/, name: "半角英数字" },
  katakana: { re: /^[ァ-ヶー\s]+$/, name: "全角カタカナ" },
  hiragana: { re: /^[ぁ-んー\s]+$/, name: "ひらがな" },
} as const;

export type CharsetName = keyof typeof CHARSETS;

export const charset =
  (name: CharsetName): Validator =>
  (value, { field }) => {
    const { re, name: display } = CHARSETS[name];
    return re.test(value) ? null : `${field.label}は${display}で入力してください`;
  };

/** 任意の正規表現によるバリデータ。message はフィールドラベルに続けて表示される */
export const pattern =
  (re: RegExp, message: string): Validator =>
  (value, { field }) =>
    re.test(value) ? null : `${field.label}${message}`;
