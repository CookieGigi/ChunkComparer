import { configs } from "../provider/providerConfig";

export default function ChunkerSelector({
	current,
	setChunker,
}: {
	current: string | undefined;
	setChunker: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	return (
		<div>
			<p>Current : {current}</p>

			{Object.entries(configs).map(([key, value]) => (
				<div key={key}>
					<button onClick={() => setChunker(key)}>{key}</button>
				</div>
			))}
		</div>
	);
}
