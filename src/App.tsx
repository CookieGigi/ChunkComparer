import { useCallback, useEffect, useState } from "react";
import "./App.css";
import ChunkedTextVisualizer from "./components/ChunkedTextVisualizer";
import ChunkerSelector from "./components/ChunkerSelector";
import { configs } from "./provider/providerConfig";
import type { Chunk } from "./types/Chunk";

const App = () => {
	const [chunks, setChunks] = useState<Chunk[]>([]);
	const [chunker, setChunker] = useState<string>();
	const [text, setText] = useState<string>();

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const text = e.target.value;
		setText(text);
	};

	const computeChunk = useCallback(
		(text: string | undefined, chunker: string | undefined) => {
			if (text === undefined) return;
			if (chunker === undefined) return;
			if (configs[chunker] === undefined) return;

			configs[chunker]
				.InstantiateChunker()
				.splitChunks(text)
				.then((chunks) => setChunks(chunks));
		},
		[],
	);

	useEffect(() => {
		computeChunk(text, chunker);
	}, [chunker, text, computeChunk]);

	return (
		<div className="layoutContainer">
			<div className="sideContainer">
				<ChunkerSelector
					current={chunker}
					setChunker={setChunker}
				></ChunkerSelector>
				<div>
					<p>Total character: {text?.length}</p>
					<p>Total chunk: {chunks.length}</p>
					<p>
						Avg chunk size:{" "}
						{(
							chunks.reduce((a, b) => a + b.text.length, 0) / chunks.length
						).toFixed(1)}
					</p>
				</div>
			</div>
			<div className="mainContainer">
				<textarea className="textContainer" onChange={onChange}></textarea>
				<ChunkedTextVisualizer chunks={chunks}></ChunkedTextVisualizer>
			</div>
		</div>
	);
};

export default App;
