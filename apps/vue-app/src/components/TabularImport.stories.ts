import type { Meta, StoryObj } from "@storybook/vue3";
import TabularImport from "./TabularImport.vue";

const meta: Meta<typeof TabularImport> = {
  title: "Components/TabularImport",
  component: TabularImport,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabularImport>;

export const Default: Story = {};
