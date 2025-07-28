import "./App.css";
import ChunkedTextVisualizer from "./components/ChunkedTextVisualizer";
import { Chunk } from "./types/Chunk";

const chunks = [
	new Chunk("Test", { prev: 0, next: 2 }),
	new Chunk("st !", { prev: 2, next: 0 }),
];

const App = () => {
	return (
		<div className="layoutContainer">
			<div className="mainContainer">
				<textarea></textarea>
				<ChunkedTextVisualizer chunks={chunks}></ChunkedTextVisualizer>
			</div>
		</div>
	);
};

export default App;
