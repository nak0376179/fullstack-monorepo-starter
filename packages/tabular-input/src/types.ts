export type Delimiter = "," | "\t";

export interface FieldContext {
  field: FieldDef;
  /** 入力テキスト上の行番号(1始まり。ヘッダ行が1行目) */
  row: number;
}

/**
 * バリデータ。エラーメッセージを返すとエラー、null を返すと合格。
 * 複数指定した場合は先頭から順に適用され、最初に失敗したものだけが報告される。
 */
export type Validator = (value: string, ctx: FieldContext) => string | null;

export interface FieldDef {
  /** 出力時のキー。ヘッダ行のカラム名としても受け付ける */
  key: string;
  /** 表示用ラベル。ヘッダ行のカラム名としても受け付ける */
  label: string;
  required: boolean;
  validators?: readonly Validator[];
}

/** スキーマの並び順がそのまま出力のカラム/キー順になる */
export type TableSchema = readonly FieldDef[];

export interface ValidationError {
  /** 入力テキスト上の行番号(1始まり)。ヘッダ全体に関するエラーは 1、入力全体に関するエラーは null */
  row: number | null;
  /** 対象フィールドのキー。特定フィールドに紐づかないエラーは null */
  field: string | null;
  message: string;
}

/**
 * 1行分のレコード。キーはスキーマの key。
 * 入力にカラム自体が存在しなかったオプション項目は undefined(JSON 出力では省略、CSV 出力では空文字)。
 */
export type TableRecord = Record<string, string | undefined>;

export interface ProcessOptions {
  /** 区切り文字。省略時はヘッダ行から自動判定 */
  delimiter?: Delimiter | "auto";
  /** 報告するエラーの最大件数(既定 10) */
  maxErrors?: number;
}

export interface ProcessResult {
  ok: boolean;
  /** パースできた行のレコード(スキーマ順のキーを持つ)。ok でない場合も参考値として返る */
  records: TableRecord[];
  /** 最大 maxErrors 件までのエラー */
  errors: ValidationError[];
  /** エラーの総数(errors に入りきらなかった分を含む) */
  totalErrorCount: number;
  /** 実際に使われた区切り文字 */
  delimiter: Delimiter;
}
