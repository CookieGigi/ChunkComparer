import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import type { Chunk } from "../types/Chunk";
import styles from "./ChunkedTextVisualizer.module.css";
import ChunkPartVisualizer from "./ChunkPartVisualizer";

const highlightChunks = (chunks: Chunk[]): JSX.Element[] => {
	const highlightedText: JSX.Element[] = [];
	const colors = ["#70d6ff", "#e9ff70", "#ff9770", "#ffd670", "#ff70a6"];
	const colorOverlap = "#00FA9A";

	chunks.forEach((chunk, index) => {
		const color = colors[index % colors.length];

		if (index === 0) {
			highlightedText.push(
				<ChunkPartVisualizer
					text={chunk.overlapPart.prev}
					color={colorOverlap}
				></ChunkPartVisualizer>,
			);
		}

		highlightedText.push(
			<ChunkPartVisualizer
				text={chunk.uniquePart}
				color={color}
			></ChunkPartVisualizer>,
		);

		// Add overlap part only if it's not the last chunk
		if (chunk.HasOverlapNextPart) {
			highlightedText.push(
				<ChunkPartVisualizer
					text={chunk.overlapPart.next}
					color={colorOverlap}
				></ChunkPartVisualizer>,
			);
		}
	});

	return highlightedText;
};

export default function ChunkedTextVisualizer({
	chunks,
	zoom,
}: {
	chunks: Chunk[];
	zoom: number | undefined;
}) {
	const [textHighlight, setTextHighlight] = useState<JSX.Element[]>([]);

	useEffect(() => {
		setTextHighlight(highlightChunks(chunks));
	}, [chunks]);

	return (
		<div
			className={styles.textVisualizer}
			data-testid="testVisualizerContainer"
			style={{ zoom: zoom === undefined ? 1 : zoom }}
		>
			{textHighlight.map((chunk) => chunk)}
		</div>
	);
}
