import { expect, fn, within } from "@storybook/test";
// biome-ignore lint/correctness/noUnusedImports: stories
import React from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import VisualizerCard from "../src/components/VisualizerCard";
import CharacterTextChunker from "../src/provider/CharacterTextChunker";
import { ChunkerConfig } from "../src/provider/providerConfig";
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
		initialConfigCollapsed: true,
	},
};

export const LongText: Story = {
	args: {
		chunkerConfig: chunkerConfig,
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test ".repeat(1000),
		title: "whiteSpace",
		initialConfigCollapsed: true,
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
		initialConfigCollapsed: true,
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

export const ConfigToggle: Story = {
	args: {
		chunkerConfig: chunkerConfig,
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test",
		title: "whiteSpace",
		initialConfigCollapsed: true,
	},
	play: async ({ userEvent, canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId("collapseConfig"));

		expect(canvas.getByTestId("collapseConfigContent")).not.toHaveStyle({
			"max-height": 0,
		});

		await userEvent.click(canvas.getByTestId("collapseConfig"));

		expect(canvas.getByTestId("collapseConfigContent")).toHaveStyle({
			"max-height": 0,
		});
	},
};

export const Config: Story = {
	args: {
		chunkerConfig: new ChunkerConfig("config", CharacterTextChunker, {
			chunkSize: 500,
			chunkOverLap: 10,
		}),
		onScroll: fn(),
		scrollRef: () => null,
		text: "Test Test Test Test",
		title: "whiteSpace",
		initialConfigCollapsed: false,
	},
};
