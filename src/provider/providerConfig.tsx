import CharacterTextChunker from "./CharacterTextChunker";
import type ITextChunker from "./ITextChunker";
import LatexTextChunker from "./LatexTextChunker";
import MarkdownTextChunker from "./MarkdownTextChunker";
import RecursiveCharacterTextChunker from "./RecursiveCharacterTextChunker";
import TokenTextChunker from "./TokenTextChunker";

export class ChunkerConfig {
	id: string;
	type: new (
		config: object,
	) => ITextChunker;
	config: object;

	constructor(
		id: string,
		type: new (config: object) => ITextChunker,
		config: object,
	) {
		this.id = id;
		this.type = type;
		this.config = config;
	}

	InstantiateChunker() {
		return new this.type(this.config);
	}

	toString() {
		return JSON.stringify(this.config);
	}

	toExampleCode() {
		return this.InstantiateChunker().toExampleCode(this.config);
	}
}

export const configs: { [key: string]: ChunkerConfig } = {
	nbChar: new ChunkerConfig("nbChar", CharacterTextChunker, {
		separator: "",
		chunkSize: 500,
		chunkOverlap: 0,
		keepSeparator: true,
	}),
	recursiveChar: new ChunkerConfig(
		"recursiveChar",
		RecursiveCharacterTextChunker,
		{
			chunkSize: 500,
			chunkOverlap: 0,
		},
	),
	token: new ChunkerConfig("token", TokenTextChunker, {
		chunkSize: 500,
		chunkOverlap: 0,
	}),
	markdown: new ChunkerConfig("markdown", MarkdownTextChunker, {
		chunkSize: 500,
		chunkOverlap: 0,
	}),
	latex: new ChunkerConfig("latex", LatexTextChunker, {
		chunkSize: 500,
		chunkOverlap: 0,
	}),
};
