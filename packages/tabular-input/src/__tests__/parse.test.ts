import { describe, expect, it } from "vitest";
import { detectDelimiter, parseDelimited } from "../parse";

describe("detectDelimiter", () => {
  it("カンマ区切りを判定する", () => {
    expect(detectDelimiter("a,b,c\n1,2,3")).toBe(",");
  });

  it("タブ区切りを判定する", () => {
    expect(detectDelimiter("a\tb\tc\n1\t2\t3")).toBe("\t");
  });

  it("区切り文字がない場合はカンマ扱いにする", () => {
    expect(detectDelimiter("single")).toBe(",");
  });
});

describe("parseDelimited", () => {
  it("基本的な CSV をパースする", () => {
    expect(parseDelimited("a,b\n1,2", ",")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("クォートされたセル(区切り文字・改行・エスケープされた引用符)を扱える", () => {
    const text = 'a,b\n"x,y","line1\nline2"\n"say ""hi""",z';
    expect(parseDelimited(text, ",")).toEqual([
      ["a", "b"],
      ["x,y", "line1\nline2"],
      ['say "hi"', "z"],
    ]);
  });

  it("CRLF と末尾の空行を扱える", () => {
    expect(parseDelimited("a,b\r\n1,2\r\n", ",")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("TSV をパースする", () => {
    expect(parseDelimited("a\tb\n1,5\t2", "\t")).toEqual([
      ["a", "b"],
      ["1,5", "2"],
    ]);
  });
});
