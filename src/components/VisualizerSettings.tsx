import { Settings } from "../types/Settings";
import styles from "./VisualizerSettings.module.css";

export default function VisualizerSettings({
	settings,
	onChange,
}: {
	settings: Settings;
	onChange: (newSettings: Settings) => void;
}) {
	return (
		<div className={styles.container}>
			<div className={styles.zoomContainer}>
				<button
					type="button"
					data-testid="unzoom"
					onClick={() => {
						onChange(Settings.unzoom(settings));
					}}
				>
					-
				</button>
				<button
					type="button"
					data-testid="resetzoom"
					onClick={() => {
						onChange(Settings.resetZoom(settings));
					}}
				>
					|
				</button>
				<button
					type="button"
					data-testid="zoom"
					onClick={() => {
						onChange(Settings.zoom(settings));
					}}
				>
					+
				</button>
			</div>
		</div>
	);
}
