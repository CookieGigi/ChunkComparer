import { expect, within } from "@storybook/test";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import VisualizersPanel from "../src/components/VisualizersPanel";
import { chunkerConfig } from "./common";
import "./testUtils";

const meta = {
	component: VisualizersPanel,
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
		exceptZoomValue(canvas, 1);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(canvas, 1.1);
		await userEvent.click(canvas.getByTestId("unzoom"));
		exceptZoomValue(canvas, 1);
		await userEvent.click(canvas.getByTestId("unzoom"));
		exceptZoomValue(canvas, 0.9);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(canvas, 1);
		await userEvent.click(canvas.getByTestId("zoom"));
		exceptZoomValue(canvas, 1.1);
		await userEvent.click(canvas.getByTestId("resetzoom"));
		exceptZoomValue(canvas, 1);
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
	play: async ({ canvasElement, userEvent }) => {
		const exceptScrollTopValue = async (
			canvas: any,
			scrollTopValue: number,
		) => {
			const elements = canvas.getAllByTestId("testVisualizerContainer");
			for (const el of elements) {
				await expect(el).toHaveStyleWithTolerance(
					{ scrollTop: scrollTopValue },
					0.01,
				);
			}
		};

		const canvas = within(canvasElement);
		canvas.getAllByTestId("testVisualizerContainer")[0].scrollTo({
			top: 100,
			left: 0,
		});
	},
};
