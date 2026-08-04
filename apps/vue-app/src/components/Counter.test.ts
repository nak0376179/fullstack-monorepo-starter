import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createVuetify } from "vuetify";
import Counter from "./Counter.vue";

const vuetify = createVuetify();

describe("Counter", () => {
  it("increments the count on click", async () => {
    const user = userEvent.setup();
    render(Counter, { global: { plugins: [vuetify] } });

    const button = screen.getByRole("button", { name: /count is 0/i });
    await user.click(button);

    expect(screen.getByRole("button", { name: /count is 1/i })).toBeInTheDocument();
  });
});
