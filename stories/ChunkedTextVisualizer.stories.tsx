import type { Meta, StoryObj } from "storybook-react-rsbuild";
import ChunkedTextVisualizer from "../src/components/ChunkedTextVisualizer";
import { Chunk } from "../src/types/Chunk";

const meta = {
	component: ChunkedTextVisualizer,
} satisfies Meta<typeof ChunkedTextVisualizer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		chunks: [
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
		],
		zoom: 1,
	},
};

export const Zoom: Story = {
	args: {
		chunks: [
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
		],
		zoom: 0.5,
	},
};

export const Unzoom: Story = {
	args: {
		chunks: [
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
			new Chunk("Test ", { prev: 0, next: 0 }),
		],
		zoom: 2,
	},
};
