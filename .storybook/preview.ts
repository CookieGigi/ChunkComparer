import type { Preview } from "storybook-react-rsbuild";

const preview: Preview = {
	parameters: {
		backgrounds: {
			options: {
				light: { name: "Light", value: "#fff" },
				dark: { name: "Dark", value: "#333" },
			},
		},
		a11y: {
			test: "error",
			context: {
				include: ["body"],
				exclude: [".no-a11y-check"],
			},
		},
	},
	tags: ["autodocs"],
};

export default preview;
