import type { Delimiter } from "./types";

/** ヘッダ行に含まれるタブとカンマの数から区切り文字を推定する */
export function detectDelimiter(text: string): Delimiter {
  const newline = text.indexOf("\n");
  const firstLine = newline === -1 ? text : text.slice(0, newline);
  const tabs = (firstLine.match(/\t/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  return tabs > 0 && tabs >= commas ? "\t" : ",";
}

/**
 * RFC 4180 風の区切りテキストをパースする。
 * ダブルクォートによる囲み("" は " にアンエスケープ)、CRLF/LF 混在に対応。
 * 末尾の空行は取り除く。
 */
export function parseDelimited(text: string, delimiter: Delimiter): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  const pushCell = () => {
    row.push(cell);
    cell = "";
  };
  const pushRow = () => {
    pushCell();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const ch = text[i] as string;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        cell += ch;
        i += 1;
      }
      continue;
    }
    if (ch === '"' && cell === "") {
      inQuotes = true;
      i += 1;
    } else if (ch === delimiter) {
      pushCell();
      i += 1;
    } else if (ch === "\n") {
      pushRow();
      i += 1;
    } else if (ch === "\r") {
      pushRow();
      i += text[i + 1] === "\n" ? 2 : 1;
    } else {
      cell += ch;
      i += 1;
    }
  }
  pushRow();

  while (rows.length > 0) {
    const last = rows[rows.length - 1] as string[];
    if (last.length === 1 && last[0] === "") {
      rows.pop();
    } else {
      break;
    }
  }
  return rows;
}
