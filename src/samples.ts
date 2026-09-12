export const samples = {
  prose: `The art of chunking

A document is more than a sequence of characters. It has a rhythm: ideas unfold in sentences, sentences gather into paragraphs, and paragraphs build an argument. Splitting that document means deciding which of those relationships to preserve.

Why boundaries matter

Imagine searching a field guide for the best time to plant a tree. One passage describes the ideal season. The next explains an important exception for colder climates. A split between them might leave you with an answer that is technically correct, but missing the context that makes it useful.

Small chunks are precise. They are easier to retrieve for a specific question and leave room for other evidence. But a small window can separate a definition from its example, or a claim from the conditions that qualify it.

Larger chunks preserve more of the surrounding story. They can also carry unrelated information, making the relevant detail harder to find. There is no universal size that resolves this trade-off for every document.

A little shared context

Overlap repeats part of one chunk in the next. Think of it as a short reminder at the beginning of a conversation: enough to reconnect the idea without repeating the entire discussion. Too little can break continuity. Too much increases duplication and processing cost.

Different ways to read

A character splitter measures the text in fixed windows. A recursive splitter looks for paragraphs, then lines, then words. A token splitter follows the units used by a particular tokenizer, which are not the same as characters or words.

Structured documents offer more clues. Markdown headings can mark a change of subject. LaTeX sections and environments can suggest useful boundaries. Those clues help a splitter respect the shape of the material, though they do not guarantee that every chunk will stand alone.

Start with a question

The best experiment begins with the questions your readers will ask. Compare a few configurations, inspect the boundaries, and look for missing context. Then evaluate retrieval with representative queries. A neat distribution of chunk sizes is informative, but it is not a measure of answer quality.

Use this workbench to make the invisible decisions visible. Change one setting at a time. Notice which sentences stay together, where context repeats, and what each strategy leaves on either side of a boundary.`,
  markdown: `# Field notes: a small urban garden

## Planning the space

Observe sunlight before choosing plants. A sunny balcony and a shaded courtyard need different approaches. Record the light at breakfast, midday, and late afternoon.

### A simple checklist

- Measure the available growing area.
- Check drainage and access to water.
- Choose containers that leave room for roots.
- Keep a small notebook of changes.

## Planting and care

Water deeply rather than frequently. The surface can look dry while the soil below remains moist. Check with a finger before reaching for the watering can.

> Healthy roots need air as well as water. Drainage is not optional.

### Tracking observations

\`\`\`json
{
  "plant": "rosemary",
  "location": "south balcony",
  "soil": "well-drained",
  "lastWatered": "Monday"
}
\`\`\`

## Learning over time

Review the notebook each month. Look for patterns instead of reacting to every yellow leaf. A garden is a long experiment: change one variable, observe, and adapt.
`,
  latex: String.raw`\section{Introduction}
Information retrieval depends on preserving meaningful context. We study how document segmentation changes the evidence available to a retrieval system.

\section{Method}
We compare fixed character windows, recursive text splitting, and token-based segmentation. Each configuration is evaluated using the same source documents and representative questions.

\begin{equation}
R = \frac{\text{relevant retrieved passages}}{\text{all relevant passages}}
\end{equation}

\subsection{Overlap}
Adjacent segments may share context. Increasing overlap can preserve continuity, but also increases redundancy. The appropriate amount depends on the structure of the document.

\section{Discussion}
Chunk length alone does not predict retrieval quality. Boundaries should be inspected alongside empirical evaluation. Repeated text and tokenizer decoding can make exact source alignment ambiguous.

\section{Conclusion}
Use segmentation metrics as diagnostic signals, not as a substitute for evaluating answers to realistic questions.`,
};
