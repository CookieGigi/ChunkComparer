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

			{Object.entries(configs).map(([key, _value]) => (
				<div key={key}>
					<button type="button" onClick={() => setChunker(key)}>
						{key}
					</button>
				</div>
			))}
		</div>
	);
}
