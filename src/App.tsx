import { useState } from "react";
import "./App.css";
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
		<div className="layoutContainer">
			<div className="sideContainer">
				<ChunkerSelector
					setChunkerConfigs={setChunkerConfigs}
				></ChunkerSelector>
			</div>
			<div className="mainContainer">
				<textarea className="textContainer" onChange={onChange}></textarea>
				<VisualizersPanel
					text={text}
					chunkerConfigs={chunkerConfigs}
				></VisualizersPanel>
			</div>
		</div>
	);
};

export default App;
