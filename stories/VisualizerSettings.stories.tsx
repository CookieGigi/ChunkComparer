import type { Meta, StoryObj } from "storybook-react-rsbuild";

import VisualizerSettings from "../src/components/VisualizerSettings";
import { contextDecorator } from "./common";

const meta = {
	component: VisualizerSettings,
	decorators: contextDecorator,
} satisfies Meta<typeof VisualizerSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
