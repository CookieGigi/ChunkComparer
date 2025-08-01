import { expect, fn, within } from "@storybook/test";
import type { Meta, StoryObj } from "storybook-react-rsbuild";

import ChunkerSelector from "../src/components/ChunkerSelector";

import { chunkerConfig, contextDecorator } from "./common";

const meta = {
	component: ChunkerSelector,
	decorators: contextDecorator,
} satisfies Meta<typeof ChunkerSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		setChunkerConfigs: fn(),
		configs: { 1: chunkerConfig },
	},
};

export const Multi: Story = {
	args: {
		setChunkerConfigs: fn(),
		configs: { 1: chunkerConfig, 2: chunkerConfig, 3: chunkerConfig },
	},
	play: async ({ args, canvasElement, userEvent }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId("chunkerselector-1"));
		expect(canvas.getByTestId("chunkerselector-1")).toBeChecked();
		expect(args.setChunkerConfigs).toHaveBeenCalled();
		await userEvent.click(canvas.getByTestId("chunkerselector-2"));
		expect(canvas.getByTestId("chunkerselector-2")).toBeChecked();
		expect(args.setChunkerConfigs).toHaveBeenCalled();
		await userEvent.click(canvas.getByTestId("chunkerselector-3"));
		expect(canvas.getByTestId("chunkerselector-3")).toBeChecked();
		expect(args.setChunkerConfigs).toHaveBeenCalled();
	},
};
