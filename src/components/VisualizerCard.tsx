import { useCallback, useEffect, useState } from "react";
import type { ChunkerConfig } from "../provider/providerConfig";
import type { Chunk } from "../types/Chunk";
import type { Settings } from "../types/Settings";
import ChunkedTextVisualizer from "./ChunkedTextVisualizer";
import styles from "./VisualizerCard.module.css";

export default function VisualizerCard({
	text,
	chunkerConfig,
	title,
	settings,
	scrollRef,
	onScroll,
}: {
	text: string | undefined;
	chunkerConfig: ChunkerConfig;
	title: string | undefined;
	settings: Settings;
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
		<div className={styles.card}>
			<div className={styles.cardHeader}>
				<span className={styles.cardHeaderTitle}>{title}</span>
				<span className={styles.cardHeaderMetric}>
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
			<div
				className={styles.cardBody}
				ref={scrollRef}
				onScroll={onScroll}
				data-testid="chunkedTextVisualizerContainer"
			>
				<ChunkedTextVisualizer
					chunks={chunks}
					zoom={settings.zoomValue}
				></ChunkedTextVisualizer>
			</div>
		</div>
	);
}
