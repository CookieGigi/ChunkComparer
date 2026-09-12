# ChunkComparer

A browser-local workbench for understanding how text-splitting strategies change document boundaries. Built with React, TypeScript, Vite, and LangChain.

## Development

Use Node.js 24 and pnpm, or enter the project's Nix development shell:

```sh
nix develop
pnpm install
pnpm dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

The build includes TypeScript checking. Tests use Node's built-in test runner and type stripping.

## Workbench

- Edit the source, load a prose, Markdown, LaTeX, Python, JavaScript, or HTML sample, or import a text file up to 2 MB.
- Add up to six independent strategies, including multiple configurations of the same method.
- Configure character, paragraph, line, recursive, token, Markdown, LaTeX, Python, JavaScript, or HTML splitting. Overlap must be nonnegative and smaller than chunk size.
- Compare two strategies side by side. On mobile, use the Source, Strategies, and Results tabs and switch strategies in the result selector.
- Switch between continuous output and separated chunk cards, adjust text size, and select a numbered boundary to inspect a chunk.
- Link selection by verified source position, not by pixel offset or chunk number.
- Copy chunk text or executable example code. Export the source, configurations, and results together as JSON.

Splitting runs in a disposable Web Worker after a short editing pause. New edits cancel obsolete workers. Configurations producing more than 10,000 chunks are rejected; the viewer initially renders 200 chunks, with a load-more control. JSON exports contain the full successful results, not just the visible portion.

## Interpreting Results

- Character budgets, displayed lengths, and source ranges use **UTF-16 code units**, not Unicode graphemes. Source ranges are zero-based and end-exclusive.
- Token budgets use the **GPT-2 tokenizer**. A token budget is not equivalent to a character budget. Token decoding can split Unicode characters; native splitter output is preserved rather than silently repaired.
- Paragraph and Line pack whole units separated by blank lines (`\n\n`) or newlines (`\n`), keeping separators and trimming boundary whitespace. Size is a packing target: an individual paragraph or line can exceed it. Overlap depends on which whole units fit.
- Python, JavaScript, and HTML use LangChain's recursive language-specific separator presets with character fallback. They are heuristics, not syntax parsers; chunks need not be valid code or balanced markup. HTML splitting retains raw tags rather than extracting rendered text.
- Amber highlighting marks **verified overlap with the preceding chunk**, measured from source ranges, not the configured overlap amount.
- Exact ranges are reported only for unique matches in the source. Repeated or unmatched text has an unavailable range. When either adjacent range is unavailable, overlap is unknown (represented as zero in the JSON `overlap` field; inspect nullable ranges to distinguish this case).
- Document view uses inline highlights rather than blocks. When all source ranges are reliable, it preserves the original source whitespace and displays overlapping text only once. If ranges are ambiguous, it displays native chunk output separated by newlines instead. Chunks view always preserves the complete native output, including duplicated overlap.
- The mini chart previews the relative lengths of the first 60 chunks. Summary metrics cover all chunks.
- These diagnostics are not retrieval-quality scores. Evaluate configurations against representative queries.

Text is processed locally and is not uploaded. Interface fonts load from Google Fonts, with local fallback fonts when offline. Nothing is persisted automatically; export before closing if you want to keep an experiment.

## Structure

- `src/App.tsx`: workspace, configuration, result lifecycle, and inspection.
- `src/App.module.css`: responsive layout and visual system.
- `src/chunking.ts`: validated splitter configuration, conservative source mapping, and example generation.
- `src/chunking.worker.ts`: isolated computation and per-strategy errors.
- `src/chunking.test.ts`: configuration, output parity, overlap, Unicode, and example-code regression tests.

Inspired by [ChunkViz](https://github.com/gkamradt/ChunkViz).
