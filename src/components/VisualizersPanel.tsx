import type { ChunkerConfig } from "../provider/providerConfig";
import VisualizerCard from "./VisualizerCard";
import "./VisualizersPanel.css";

export default function VisualizersPanel({
	text,
	chunkerConfigs,
}: {
	text: string | undefined;
	chunkerConfigs: { [key: string]: ChunkerConfig } | undefined;
}) {
	return (
		<div className="mainContainer">
			{Object.entries(chunkerConfigs ?? {}).map(([key, value]) => (
				<div key={key} className="cardContainer">
					<VisualizerCard
						text={text}
						chunkerConfig={value}
						title={key}
					></VisualizerCard>
				</div>
			))}
		</div>
	);
}
