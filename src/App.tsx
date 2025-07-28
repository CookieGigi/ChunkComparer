import { useState } from "react";
import "./App.css";
import ChunkedTextVisualizer from "./components/ChunkedTextVisualizer";
import CharacterTextChunker from "./provider/CharacterTextChunker";
import type ITextChunker from "./provider/ITextChunker";
import type { Chunk } from "./types/Chunk";

const chunker: ITextChunker = new CharacterTextChunker({
	separator: "",
	chunkSize: 10,
	chunkOverlap: 2,
	keepSeparator: true,
});

const App = () => {
	const [chunks, setChunks] = useState<Chunk[]>([]);

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const text = e.target.value;

		if (text == null) return;

		chunker.splitChunks(text).then((chunks) => setChunks(chunks));
	};

	return (
		<div className="layoutContainer">
			<div className="mainContainer">
				<textarea onChange={onChange}></textarea>
				<ChunkedTextVisualizer chunks={chunks}></ChunkedTextVisualizer>
			</div>
		</div>
	);
};

export default App;
