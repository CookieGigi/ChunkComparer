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
		chunkerConfigs: { 1: chunkerConfig },
	},
	play: async ({ canvasElement, userEvent }) => {
		const exceptZoomValue = async (
			elements: HTMLElement[],
			zoomValue: number,
		) => {
			for (const el of elements) {
				await expect(el).toHaveStyleWithTolerance({ zoom: zoomValue }, 0.01);
			}
		};

		const canvas = within(canvasElement);

		const zoomBtn = canvas.getByTestId("zoom");
		const unzoomBtn = canvas.getByTestId("unzoom");
		const resetzoomBtn = canvas.getByTestId("resetzoom");
		const containers = canvas.getAllByTestId("testVisualizerContainer");

		exceptZoomValue(containers, defaultSettings.zoomValue);
		await userEvent.click(zoomBtn);
		exceptZoomValue(
			containers,
			defaultSettings.zoomValue + defaultSettings.zoomIncrement,
		);
		await userEvent.click(unzoomBtn);
		exceptZoomValue(containers, defaultSettings.zoomValue);
		await userEvent.click(unzoomBtn);
		exceptZoomValue(
			containers,
			defaultSettings.zoomValue - defaultSettings.zoomIncrement,
		);
		await userEvent.click(zoomBtn);
		exceptZoomValue(containers, defaultSettings.zoomValue);
		await userEvent.click(zoomBtn);
		exceptZoomValue(
			containers,
			defaultSettings.zoomValue + defaultSettings.zoomIncrement,
		);
		await userEvent.click(resetzoomBtn);
		exceptZoomValue(containers, defaultSettings.zoomValue);
	},
	parameters: {
		a11y: { test: "off" },
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
		chunkerConfigs: { 1: chunkerConfig, 2: chunkerConfig },
	},
	play: async ({ canvasElement, step }) => {
		const exceptScrollTopValue = async (
			elements: HTMLElement[],
			scrollTopValue: number,
		) => {
			for (const el of elements) {
				await expect(el).toHaveStyleWithTolerance(
					{ scrollTop: scrollTopValue },
					0.01,
				);
			}
		};

		const canvas = within(canvasElement);

		const containers = canvas.getAllByTestId("chunkedTextVisualizerContainer");

		await step("scroll", async () => {
			containers[0].scrollTo({
				top: 1000,
				left: 0,
			});
		});
		await exceptScrollTopValue(containers, 1000);
		await step("scroll", async () => {
			containers[1].scrollTo({
				top: 500,
				left: 0,
			});
		});
		exceptScrollTopValue(containers, 500);
	},
	parameters: {
		a11y: { test: "off" },
	},
};
