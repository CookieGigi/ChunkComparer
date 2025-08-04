import type { StorybookConfig } from "storybook-react-rsbuild";

const config: StorybookConfig = {
	framework: "storybook-react-rsbuild",

	rsbuildFinal: (config) => {
		// Customize the final Rsbuild config here
		return config;
	},

	stories: ["../stories/**/*.mdx", "../stories/*.stories.@(js|jsx|mjs|ts|tsx)"],

	core: {
		disableTelemetry: true, // 👈 Disables telemetry
	},

	addons: [
		"@storybook/addon-a11y",
		"@chromatic-com/storybook",
		"@storybook/addon-docs",
	],
	docs: {
		//👇 See the table below for the list of supported options
		defaultName: "Documentation",
	},
};

export default config;
