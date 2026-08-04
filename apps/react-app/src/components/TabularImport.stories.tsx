import type { Meta, StoryObj } from "@storybook/react";
import { TabularImport } from "./TabularImport";

const meta: Meta<typeof TabularImport> = {
  title: "Components/TabularImport",
  component: TabularImport,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabularImport>;

export const Default: Story = {};
