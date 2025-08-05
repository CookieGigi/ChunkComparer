import SyntaxHighlighter from "react-syntax-highlighter";
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
				<SyntaxHighlighter language="json" showLineNumbers wrapLines>
					{config.toString()}
				</SyntaxHighlighter>
			</div>
			<p>Code</p>
			<div>
				<SyntaxHighlighter language="typescript" showLineNumbers wrapLines>
					{config.toExampleCode()}
				</SyntaxHighlighter>
			</div>
		</div>
	);
}
