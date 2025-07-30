// biome-ignore lint/correctness/noUnusedImports: stories
import React from "react";
import type { DecoratorFunction } from "storybook/internal/csf";
import type { ReactRenderer } from "storybook-react-rsbuild";
import { SettingsProvider } from "../src/contexts/SettingsContext";
import { ChunkerConfig } from "../src/provider/providerConfig";
import { defaultSettings } from "../src/types/Settings";
import WhiteSpaceSeparatorTextChunker from "./WhiteSpaceSeparatorTextChunker";

// biome-ignore lint/suspicious/noExplicitAny: stories
export const contextDecorator: DecoratorFunction<ReactRenderer, any> = (
	Story,
) => (
	<SettingsProvider initialSettings={defaultSettings}>
		<Story />
	</SettingsProvider>
);

export const chunkerConfig = new ChunkerConfig(
	"whiteSpace",
	WhiteSpaceSeparatorTextChunker,
	{},
);
