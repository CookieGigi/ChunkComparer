import { CopyBlock, dracula } from "react-code-blocks";
import type { ChunkerConfig } from "../provider/providerConfig";

export default function ChunkerConfigVisualizer({
	config,
}: {
	config: ChunkerConfig;
}) {
	return (
		<div>
			<p>Config</p>
			<CopyBlock
				text={config.toString()}
				language="json"
				showLineNumbers={true}
				wrapLongLines
				theme={dracula}
			></CopyBlock>
			<p>Code</p>
			<CopyBlock
				text={config.toExampleCode()}
				language="ts"
				showLineNumbers
				wrapLongLines
				theme={dracula}
			></CopyBlock>
		</div>
	);
}
