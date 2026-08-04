# @repo/tabular-input

ヘッダ行付きの CSV / TSV テキストをパースし、スキーマに従ってバリデーションして JSON / CSV に変換する、**フレームワーク非依存**のコアライブラリです。React・Vue どちらからも同じ API で利用できます(依存パッケージなし・ビルド不要)。

UI サンプル:

| フレームワーク | コンポーネント                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| React + MUI    | [`apps/react-app/src/components/TabularImport.tsx`](../../apps/react-app/src/components/TabularImport.tsx) |
| Vue + Vuetify  | [`apps/vue-app/src/components/TabularImport.vue`](../../apps/vue-app/src/components/TabularImport.vue)     |

## クイックスタート

```ts
import {
  processTable,
  toJson,
  toCsv,
  maxLength,
  email,
  charset,
  type TableSchema,
} from "@repo/tabular-input";

// スキーマ定義: 定義順がそのまま出力順になる
const schema: TableSchema = [
  { key: "name", label: "氏名", required: true, validators: [maxLength(50)] },
  { key: "email", label: "メールアドレス", required: true, validators: [email()] },
  { key: "age", label: "年齢", required: false, validators: [charset("digits")] },
];

const result = processTable("name,email,age\n山田,taro@example.com,34", schema);

if (result.ok) {
  toJson(result.records, schema); // '[{ "name": "山田", ... }]'
  toCsv(result.records, schema); // 'name,email,age\n山田,taro@example.com,34'
} else {
  // result.errors は最大 10 件。総数は result.totalErrorCount
  for (const e of result.errors) console.log(`${e.row}行目: ${e.message}`);
}
```

## 入力仕様

- **ヘッダ行必須**。カラム名はフィールドの `key`(`name` など)と `label`(`氏名` など)のどちらでも可
- **区切り文字は自動判定**(ヘッダ行のタブ数 ≥ カンマ数なら TSV)。`processTable(text, schema, { delimiter: "\t" })` で明示指定も可能
- ダブルクォート囲み・`""` エスケープ・セル内改行・CRLF/LF 混在に対応(RFC 4180 準拠)
- セル値は前後の空白をトリムしてから検証。完全な空行はスキップ

## バリデーション

フィールドごとに `validators` 配列で自由に組み合わせます。先頭から順に適用し、**最初に失敗した 1 件だけ**をエラーとして報告します。

| バリデータ                                                        | 内容                                             |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| `maxLength(n)` / `minLength(n)`                                   | 文字列長                                         |
| `email()`                                                         | メールアドレス形式                               |
| `charset("digits" \| "alphanumeric" \| "katakana" \| "hiragana")` | 文字種                                           |
| `pattern(regex, "は◯◯で入力してください")`                        | 任意の正規表現(メッセージはラベルに続く形で指定) |

独自バリデータは `(value, { field, row }) => string | null` を満たす関数を書くだけで追加できます(`null` = 合格)。

### エラーの扱い

- 報告は**最大 10 件**(`maxErrors` オプションで変更可)。総数は `totalErrorCount` に入る
- `row` は入力テキスト上の 1 始まり行番号(ヘッダ = 1 行目)
- ヘッダ自体に問題がある場合(不明カラム / 重複 / 必須カラム欠落)はその時点で中断し `records` は空
- 必須項目の空欄はエラー。オプション項目の空欄はバリデータをスキップ

## 出力仕様

- **カラム / キーの順序はスキーマ定義順**(入力のカラム順には依存しない)
- `toJson`: 入力にカラム自体が無かったオプション項目はキーごと省略
- `toCsv`: 全フィールドを出力し、値が無い項目は空欄。必要なセルは自動でクォート

## 項目を追加するには

1. スキーマ配列の**出力したい位置**に `FieldDef` を追加する(順序 = 出力順)
2. UI サンプルに反映する場合は `sampleSchema.ts` の `userImportSchema` を編集(React / Vue 両方に自動反映)

## 開発

```bash
pnpm --filter @repo/tabular-input test        # コアの単体テスト
pnpm test / pnpm lint / pnpm typecheck        # リポジトリ全体(ルートで実行)
```

ソースは `src/` 直下の TypeScript をそのまま公開しています(`exports: ./src/index.ts`)。ビルドステップはなく、利用側アプリのバンドラ / tsc がコンパイルします。
