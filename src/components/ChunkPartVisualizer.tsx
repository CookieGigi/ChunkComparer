import "./ChunkPartVisualizer.css";

export default function ChunkPartVisualizer({
	text,
	color,
}: {
	text: string;
	color: string | undefined;
}) {
	return (
		<span className="chunkPart" style={{ backgroundColor: color }}>
			{text}
		</span>
	);
}
