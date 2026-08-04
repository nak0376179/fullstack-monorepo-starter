import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createVuetify } from "vuetify";
import TabularImport from "./TabularImport.vue";

const vuetify = createVuetify();

describe("TabularImport", () => {
  it("有効な CSV を JSON に変換する", async () => {
    const user = userEvent.setup();
    render(TabularImport, { global: { plugins: [vuetify] } });

    await user.click(screen.getByRole("button", { name: "CSVサンプル" }));
    await user.click(screen.getByRole("button", { name: "検証して変換" }));

    expect(screen.getByText(/3件のデータを JSON に変換しました/)).toBeInTheDocument();
    const output = screen.getByLabelText("出力(JSON)") as HTMLTextAreaElement;
    expect(JSON.parse(output.value)).toHaveLength(3);
    expect(JSON.parse(output.value)[0]).toMatchObject({ name: "山田 太郎" });
  });

  it("不正な入力ではエラー一覧を表示する", async () => {
    const user = userEvent.setup();
    render(TabularImport, { global: { plugins: [vuetify] } });

    await user.click(screen.getByRole("button", { name: "エラーサンプル" }));
    await user.click(screen.getByRole("button", { name: "検証して変換" }));

    expect(screen.getByText(/件のエラーがあります/)).toBeInTheDocument();
    expect(screen.getByText(/氏名は必須です/)).toBeInTheDocument();
  });
});
