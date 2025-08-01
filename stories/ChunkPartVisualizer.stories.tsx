import type { Meta, StoryObj } from "storybook-react-rsbuild";
import ChunkPartVisualizer from "../src/components/ChunkPartVisualizer";
import { contextDecorator } from "./common";

const meta = {
	component: ChunkPartVisualizer,
	decorators: contextDecorator,
} satisfies Meta<typeof ChunkPartVisualizer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { text: "Test", color: "#fff000" } };
