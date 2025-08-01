import { expect, within } from "@storybook/test";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import VisualizersPanel from "../src/components/VisualizersPanel";
import { chunkerConfig, contextDecorator } from "./common";
import "./testUtils";
import { defaultSettings } from "../src/types/Settings";

const meta = {
	component: VisualizersPanel,
	decorators: contextDecorator,
} satisfies Meta<typeof VisualizersPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		text: "Test ".repeat(10),
		chunkerConfigs: { chunkerConfig },
	},
};

export const MultiConfig: Story = {
	args: {
		text: "Test ".repeat(10),
		chunkerConfigs: { 1: chunkerConfig, 2: chunkerConfig, 3: chunkerConfig },
	},
};

export const Zoom: Story = {
	args: {
		text: "Test ".repeat(10),
		chunkerConfigs: { 1: chunkerConfig, 2: chunkerConfig, 3: chunkerConfig },
	},
	play: async ({ canvasElement, userEvent }) => {
		// biome-ignore lint/suspicious/noExplicitAny: stories
		const exceptZoomValue = async (canvas: any, zoomValue: number) => {
			const elements = canvas.getAllByTestId("testVisualizerContainer");
			for (const el of elements) {
				await expect(el).toHaveStyleWithTolerance({ zoom: zoomValue }, 0.01);
			}
		};

		const canvas = within(canvasElement);
		exceptZoomValue(canvas, defaultSettings.zoomValue);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(
			canvas,
			defaultSettings.zoomValue + defaultSettings.zoomIncrement,
		);
		await userEvent.click(canvas.getByTestId("unzoom"));
		exceptZoomValue(canvas, defaultSettings.zoomValue);
		await userEvent.click(canvas.getByTestId("unzoom"));
		exceptZoomValue(
			canvas,
			defaultSettings.zoomValue - defaultSettings.zoomIncrement,
		);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(canvas, defaultSettings.zoomValue);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(
			canvas,
			defaultSettings.zoomValue + defaultSettings.zoomIncrement,
		);
		await userEvent.click(canvas.getByTestId("resetzoom"));
		exceptZoomValue(canvas, defaultSettings.zoomValue);
	},
};

export const LongText: Story = {
	args: {
		text: "Test ".repeat(1000),
		chunkerConfigs: { 1: chunkerConfig, 2: chunkerConfig, 3: chunkerConfig },
	},
};

export const SyncScroll: Story = {
	args: {
		text: "Test ".repeat(1000),
		chunkerConfigs: { 1: chunkerConfig, 2: chunkerConfig, 3: chunkerConfig },
	},
	play: async ({ canvasElement, step }) => {
		const elScroller = "chunkedTextVisualizerContainer";
		const exceptScrollTopValue = async (
			// biome-ignore lint/suspicious/noExplicitAny: stories
			canvas: any,
			scrollTopValue: number,
		) => {
			const elements = canvas.getAllByTestId(elScroller);
			for (const el of elements) {
				await expect(el).toHaveStyleWithTolerance(
					{ scrollTop: scrollTopValue },
					0.01,
				);
			}
		};

		const canvas = within(canvasElement);
		await step("scroll", async () => {
			canvas.getAllByTestId(elScroller)[0].scrollTo({
				top: 1000,
				left: 0,
			});
		});
		await exceptScrollTopValue(canvas, 1000);
		await step("scroll", async () => {
			canvas.getAllByTestId(elScroller)[1].scrollTo({
				top: 500,
				left: 0,
			});
		});
		exceptScrollTopValue(canvas, 500);
	},
};
