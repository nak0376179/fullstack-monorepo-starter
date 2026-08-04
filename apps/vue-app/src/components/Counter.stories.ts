import type { Meta, StoryObj } from "@storybook/vue3";
import Counter from "./Counter.vue";

const meta: Meta<typeof Counter> = {
  title: "Components/Counter",
  component: Counter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Counter>;

export const Default: Story = {
  args: {
    initialCount: 0,
  },
};

export const StartsAtFive: Story = {
  args: {
    initialCount: 5,
  },
};
