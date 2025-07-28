import CharacterTextChunker from "./CharacterTextChunker";
import type ITextChunker from "./ITextChunker";

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
		chunkSize: 10,
		chunkOverlap: 2,
		keepSeparator: true,
	}),
	nbChar30: new ChunkerConfig("nbChar", CharacterTextChunker, {
		separator: "",
		chunkSize: 30,
		chunkOverlap: 2,
		keepSeparator: true,
	}),
};
