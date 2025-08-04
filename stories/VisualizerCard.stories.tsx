import { expect, fn, within } from "@storybook/test";
// biome-ignore lint/correctness/noUnusedImports: stories
import React from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import VisualizerCard from "../src/components/VisualizerCard";
import { defaultSettings } from "../src/types/Settings";
import { chunkerConfig, contextDecorator } from "./common";

const meta = {
	component: VisualizerCard,
	decorators: contextDecorator,
	args: {
		settings: defaultSettings,
	},
} satisfies Meta<typeof VisualizerCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		chunkerConfig: chunkerConfig,
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test",
		title: "whiteSpace",
	},
};

export const LongText: Story = {
	args: {
		chunkerConfig: chunkerConfig,
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test ".repeat(1000),
		title: "whiteSpace",
	},

	decorators: [
		(Story) => (
			<div style={{ height: "50vh" }}>
				<Story />
			</div>
		),
	],
	parameters: {
		a11y: { test: "off" },
	},
};

export const Modal: Story = {
	args: {
		chunkerConfig: chunkerConfig,
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test ".repeat(1000),
		title: "whiteSpace",
	},
	play: async ({ userEvent, canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId("VisualizerCard"));

		const modal = canvas.getByTestId("modal");

		expect(modal).toBeVisible();

		await userEvent.click(canvas.getByTestId("modal-close"));

		expect(modal).not.toBeInTheDocument();
	},
	parameters: {
		a11y: { test: "off" },
	},
};
