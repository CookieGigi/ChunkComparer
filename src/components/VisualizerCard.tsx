import { useCallback, useEffect, useState } from "react";
import type { ChunkerConfig } from "../provider/providerConfig";
import type { Chunk } from "../types/Chunk";
import ChunkedTextVisualizer from "./ChunkedTextVisualizer";

export default function VisualizerCard({
	text,
	chunkerConfig,
	title,
}: {
	text: string | undefined;
	chunkerConfig: ChunkerConfig;
	title: string | undefined;
}) {
	const [chunks, setChunks] = useState<Chunk[]>([]);

	const computeChunk = useCallback(
		(text: string | undefined, chunkerConfig: ChunkerConfig | undefined) => {
			if (text === undefined) return;
			if (chunkerConfig === undefined) return;

			chunkerConfig
				.InstantiateChunker()
				.splitChunks(text)
				.then((chunks) => setChunks(chunks));
		},
		[],
	);

	useEffect(() => {
		computeChunk(text, chunkerConfig);
	}, [chunkerConfig, text, computeChunk]);

	return (
		<div className="card">
			<div className="card-header">
				<span>{title}</span>
			</div>
			<div className="card-body">
				<ChunkedTextVisualizer chunks={chunks}></ChunkedTextVisualizer>
			</div>
			<div className="card-footer">
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
	);
}
