import { useState } from "react";
import styles from "./App.module.css";
import ChunkerSelector from "./components/ChunkerSelector";
import VisualizersPanel from "./components/VisualizersPanel";
import type { ChunkerConfig } from "./provider/providerConfig";

const App = () => {
	const [chunkerConfigs, setChunkerConfigs] = useState<
		| {
				[key: string]: ChunkerConfig;
		  }
		| undefined
	>();
	const [text, setText] = useState<string>();

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const text = e.target.value;
		setText(text);
	};

	return (
		<div className={styles.layoutContainer}>
			<div className={styles.inputContainer}>
				<div className={styles.configContainer}>
					<ChunkerSelector
						setChunkerConfigs={setChunkerConfigs}
					></ChunkerSelector>
				</div>
				<div className={styles.textContainer}>
					<textarea className={styles.textInput} onChange={onChange}></textarea>
				</div>
			</div>

			<div className={styles.visualizerContainer}>
				<VisualizersPanel
					text={text}
					chunkerConfigs={chunkerConfigs}
				></VisualizersPanel>
			</div>
		</div>
	);
};

export default App;
