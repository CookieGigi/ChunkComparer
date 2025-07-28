import { CharacterTextSplitter } from "langchain/text_splitter";
import { Chunk } from "../types/Chunk";
import type ITextChunker from "./ITextChunker";

export default class CharacterTextChunker
	extends CharacterTextSplitter
	implements ITextChunker
{
	async splitChunks(text: string): Promise<Chunk[]> {
		const textSplit = await this.splitText(text);

		const res: Chunk[] = [];
		for (text of textSplit) {
			if (this.separator === " ") {
				text += " ";
			}
			res.push(
				new Chunk(text, { prev: this.chunkOverlap, next: this.chunkOverlap }),
			);
		}

		return res;
	}
}
