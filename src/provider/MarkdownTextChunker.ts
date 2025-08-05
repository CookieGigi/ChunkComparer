import { MarkdownTextSplitter } from "langchain/text_splitter";
import { Chunk } from "../types/Chunk";
import type ITextChunker from "./ITextChunker";

export default class MarkdownTextChunker
	extends MarkdownTextSplitter
	implements ITextChunker
{
	async splitChunks(text: string): Promise<Chunk[]> {
		const textSplit = await this.splitText(text);

		const res: Chunk[] = [];
		for (text of textSplit) {
			res.push(new Chunk(text, { prev: 0, next: 0 }));
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
			'import { MarkdownTextSplitter } from "langchain/text_splitter";\n' +
			`const textSplitter = MarkdownTextSplitter(${JSON.stringify(config).replace(/"([^"]+)":/g, "$1:")});\n` +
			"const textSplit = textSplitter.splitText();"
		);
	}
}
