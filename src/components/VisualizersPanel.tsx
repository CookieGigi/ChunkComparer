import { useRef } from "react";
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
	const divRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

	const handleScroll = (key: string) => {
		const scrollTop = divRefs.current[key]?.scrollTop;
		if (scrollTop !== undefined) {
			for (const div of Object.entries(divRefs.current)) {
				if (div[0] !== key) {
					const targetDiv = divRefs.current[div[0]];
					if (targetDiv !== null) {
						targetDiv.scrollTop = scrollTop;
					}
				}
			}
		}
	};

	return (
		<div className="mainContainer">
			{Object.entries(chunkerConfigs ?? {}).map(([key, value]) => (
				<div key={key} className="cardContainer">
					<VisualizerCard
						text={text}
						chunkerConfig={value}
						title={key}
						scrollRef={(el: HTMLDivElement | null) => {
							divRefs.current[key] = el;
						}}
						onScroll={() => handleScroll(key)}
					></VisualizerCard>
				</div>
			))}
		</div>
	);
}
