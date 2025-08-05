import { TokenTextSplitter } from "langchain/text_splitter";
import { Chunk } from "../types/Chunk";
import type ITextChunker from "./ITextChunker";

export default class TokenTextChunker
	extends TokenTextSplitter
	implements ITextChunker
{
	async splitChunks(text: string): Promise<Chunk[]> {
		const textSplit = await this.splitText(text);

		const res: Chunk[] = [];
		for (text of textSplit) {
			res.push(
				new Chunk(text, { prev: this.chunkOverlap, next: this.chunkOverlap }),
			);
		}

		return res;
	}

	private override joinDocs(docs, separator) {
		// LangChain trims chunks, we don't want that for visuals!
		// Hacky override
		return docs.join(separator);
	}

	toExampleCode(config: object): string {
		return (
			'import { TokenTextSplitter } from "langchain/text_splitter";\n' +
			`const textSplitter = TokenTextSplitter(${JSON.stringify(config).replace(/"([^"]+)":/g, "$1:")});\n` +
			"const textSplit = textSplitter.splitText();"
		);
	}
}
