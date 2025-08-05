import { a11yLight, CopyBlock, dracula } from "react-code-blocks";
import type { ChunkerConfig } from "../provider/providerConfig";

export default function ChunkerConfigVisualizer({
	config,
}: {
	config: ChunkerConfig;
}) {
	return (
		<div>
			<p>Config</p>
			<div>
				<CopyBlock
					text={config.toString()}
					language="json"
					showLineNumbers={true}
					wrapLongLines
					theme={a11yLight}
				></CopyBlock>
			</div>
			<p>Code</p>
			<div>
				<CopyBlock
					text={config.toExampleCode()}
					language="ts"
					showLineNumbers
					wrapLongLines
					theme={a11yLight}
				></CopyBlock>
			</div>
		</div>
	);
}
