import { useRef, useState } from "react";
import type { ChunkerConfig } from "../provider/providerConfig";
import { defaultSettings, type Settings } from "../types/Settings";
import VisualizerCard from "./VisualizerCard";
import VisualizerSettings from "./VisualizerSettings";
import styles from "./VisualizersPanel.module.css";

export default function VisualizersPanel({
	text,
	chunkerConfigs,
}: {
	text: string | undefined;
	chunkerConfigs: { [key: string]: ChunkerConfig } | undefined;
}) {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

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
		<div className={styles.mainContainer}>
			<div className={styles.settingsContainer}>
				<VisualizerSettings
					settings={settings}
					onChange={(s) => setSettings(s)}
				/>
			</div>
			<div className={styles.cardsContainer}>
				{Object.entries(chunkerConfigs ?? {}).map(([key, value]) => (
					<div key={key} className={styles.cardContainer}>
						<VisualizerCard
							text={text}
							chunkerConfig={value}
							title={key}
							settings={settings}
							scrollRef={(el: HTMLDivElement | null) => {
								divRefs.current[key] = el;
							}}
							onScroll={() => handleScroll(key)}
						></VisualizerCard>
					</div>
				))}
			</div>
		</div>
	);
}
