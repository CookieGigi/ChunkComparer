import styles from "./ChunkPartVisualizer.module.css";

export default function ChunkPartVisualizer({
	text,
	color,
}: {
	text: string;
	color: string | undefined;
}) {
	return (
		<span className={styles.chunkPart} style={{ backgroundColor: color }}>
			{text}
		</span>
	);
}
