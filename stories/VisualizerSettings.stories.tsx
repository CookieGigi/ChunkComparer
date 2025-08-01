import { expect, fn, within } from "@storybook/test";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import VisualizerSettings from "../src/components/VisualizerSettings";
import { defaultSettings } from "../src/types/Settings";
import { contextDecorator } from "./common";

const meta = {
	component: VisualizerSettings,
	decorators: contextDecorator,
} satisfies Meta<typeof VisualizerSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { settings: defaultSettings, onChange: fn() },
};

var mockSettings = { ...defaultSettings };

export const Buttons: Story = {
	args: { settings: mockSettings, onChange: fn() },
	play: async ({ userEvent, canvasElement, args }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId("zoom"));

		expect(args.onChange).toHaveBeenCalledWith({
			...mockSettings,
			zoomValue: mockSettings.zoomValue + mockSettings.zoomIncrement,
		});

		await userEvent.click(canvas.getByTestId("resetzoom"));

		expect(args.onChange).toHaveBeenCalledWith({
			...mockSettings,
			zoomValue: mockSettings.zoomValue,
		});

		await userEvent.click(canvas.getByTestId("unzoom"));

		expect(args.onChange).toHaveBeenCalledWith({
			...mockSettings,
			zoomValue: mockSettings.zoomValue - mockSettings.zoomIncrement,
		});
	},
};
