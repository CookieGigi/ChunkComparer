import { useSettings } from "../contexts/SettingsContext";
import { Settings } from "../types/Settings";
import styles from "./VisualizerSettings.module.css";

export default function VisualizerSettings() {
	const { settings, updateSettings } = useSettings();

	return (
		<div className={styles.container}>
			<div className={styles.zoomContainer}>
				<button
					type="button"
					onClick={() => {
						updateSettings(Settings.unzoom(settings));
					}}
				>
					-
				</button>
				<button
					type="button"
					onClick={() => {
						updateSettings(Settings.resetZoom(settings));
					}}
				>
					|
				</button>
				<button
					type="button"
					onClick={() => {
						updateSettings(Settings.zoom(settings));
					}}
				>
					+
				</button>
			</div>
		</div>
	);
}
