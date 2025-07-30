import type { Preview } from "storybook-react-rsbuild";

const preview: Preview = {
	parameters: {
		backgrounds: {
			options: {
				light: { name: "Light", value: "#fff" },
				dark: { name: "Dark", value: "#333" },
			},
		},
	},
};

export default preview;
