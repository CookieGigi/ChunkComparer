import { fn } from "@storybook/test";
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
