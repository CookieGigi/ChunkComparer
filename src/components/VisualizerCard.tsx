import { useCallback, useEffect, useState } from "react";
import type { ChunkerConfig } from "../provider/providerConfig";
import type { Chunk } from "../types/Chunk";
import ChunkedTextVisualizer from "./ChunkedTextVisualizer";
import "./VisualizerCard.css";

export default function VisualizerCard({
	text,
	chunkerConfig,
	title,
	scrollRef,
	onScroll,
}: {
	text: string | undefined;
	chunkerConfig: ChunkerConfig;
	title: string | undefined;
	scrollRef: (el: HTMLDivElement | null) => void;
	onScroll: () => void;
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
				<span className="card-header-title">{title}</span>
				<span className="card-header-metric">
					{" "}
					<span>{chunks.length} chunks</span>
					<span className="card-header-metric">
						{(
							chunks.reduce((a, b) => a + b.text.length, 0) / chunks.length
						).toFixed(1)}{" "}
						size/chunk
					</span>
				</span>
			</div>
			<div className="card-body" ref={scrollRef} onScroll={onScroll}>
				<ChunkedTextVisualizer chunks={chunks}></ChunkedTextVisualizer>
			</div>
		</div>
	);
}
