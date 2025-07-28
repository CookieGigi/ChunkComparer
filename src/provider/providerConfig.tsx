import CharacterTextChunker from "./CharacterTextChunker";
import type ITextChunker from "./ITextChunker";
import RecursiveCharacterTextChunker from "./RecursiveCharacterTextChunker";

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
}

export const configs: { [key: string]: ChunkerConfig } = {
	nbChar: new ChunkerConfig("nbChar", CharacterTextChunker, {
		separator: "",
		chunkSize: 100,
		chunkOverlap: 0,
		keepSeparator: true,
	}),
	recursiveChar: new ChunkerConfig(
		"recursiveChar",
		RecursiveCharacterTextChunker,
		{
			chunkSize: 100,
			chunkOverlap: 0,
		},
	),
};
