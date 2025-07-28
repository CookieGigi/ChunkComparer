import type { Chunk } from "../types/Chunk";

export default interface ITextChunker {
	splitChunks(text: string): Promise<Chunk[]>;
}
