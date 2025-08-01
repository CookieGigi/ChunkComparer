import type ITextChunker from "../src/provider/ITextChunker";
import { Chunk } from "../src/types/Chunk";

export default class WhiteSpaceSeparatorTextChunker implements ITextChunker {
	async splitChunks(text: string): Promise<Chunk[]> {
		const textSplit = text.split(" ");

		const res: Chunk[] = [];
		for (text of textSplit) {
			res.push(new Chunk(`${text} `, { prev: 0, next: 0 }));
		}

		return res;
	}
}
