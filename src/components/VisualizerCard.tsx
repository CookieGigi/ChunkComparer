import { useCallback, useEffect, useState } from "react";
import type { ChunkerConfig } from "../provider/providerConfig";
import type { Chunk } from "../types/Chunk";
import type { Settings } from "../types/Settings";
import ChunkedTextVisualizer from "./ChunkedTextVisualizer";
import Modal from "./Modal";
import styles from "./VisualizerCard.module.css";

export default function VisualizerCard({
	text,
	chunkerConfig,
	title,
	settings,
	scrollRef,
	onScroll,
	initialConfigCollapsed,
}: {
	text: string | undefined;
	chunkerConfig: ChunkerConfig;
	title: string | undefined;
	settings: Settings;
	scrollRef: (el: HTMLDivElement | null) => void;
	onScroll: () => void;
	initialConfigCollapsed: boolean | undefined;
}) {
	const [chunks, setChunks] = useState<Chunk[]>([]);
	const [isCollapsed, setIsCollapsed] = useState(
		initialConfigCollapsed ?? true,
	);

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

	const toggleCollapse: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsCollapsed(!isCollapsed);
	};

	const CardContent = () => (
		<>
			<div className={styles.cardHeader}>
				<span className={styles.cardHeaderTitle}>{title}</span>
				<span className={styles.cardHeaderMetrics}>
					{" "}
					<span className={styles.cardHeaderMetric}>
						{chunks.length} chunks
					</span>
					<span className={styles.cardHeaderMetric}>
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
				// biome-ignore lint/a11y/noNoninteractiveTabindex: accessibility
				tabIndex={0}
			>
				<ChunkedTextVisualizer
					chunks={chunks}
					zoom={settings.zoomValue}
				></ChunkedTextVisualizer>
			</div>
		</>
	);

	const [modalOpen, setModalOpen] = useState(false);
	const openModal = () => {
		setModalOpen(true);
	};
	const onClose = () => {
		setModalOpen(false);
	};

	const Config = () => (
		<>
			<button
				type="button"
				onClick={toggleCollapse}
				className={styles.collapseButton}
				data-TestId="collapseConfig"
			>
				{isCollapsed ? "Show Config" : "Hide Config"}
			</button>
			<div
				className={`${styles.collapsibleContent} ${isCollapsed ? styles.collapsed : ""}`}
				data-TestId="collapseConfigContent"
			>
				<p>{chunkerConfig.toString()}</p>
			</div>
		</>
	);

	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className={styles.card}
				data-TestId="VisualizerCard"
			>
				<CardContent></CardContent>
			</button>
			<Config></Config>

			<Modal onClose={onClose} isOpen={modalOpen}>
				<CardContent></CardContent>
				<Config></Config>
			</Modal>
		</>
	);
}
