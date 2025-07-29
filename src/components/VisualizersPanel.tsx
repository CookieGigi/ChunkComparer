import type { ChunkerConfig } from "../provider/providerConfig";
import VisualizerCard from "./VisualizerCard";

export default function VisualizersPanel({
	text,
	chunkerConfigs,
}: {
	text: string | undefined;
	chunkerConfigs: { [key: string]: ChunkerConfig } | undefined;
}) {
	return (
		<div className="visualizerPanelContainer">
			{Object.entries(chunkerConfigs ?? {}).map(([key, value]) => (
				<div key={key}>
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
