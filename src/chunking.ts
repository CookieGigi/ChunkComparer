export type Method =
  | "character"
  | "paragraph"
  | "line"
  | "recursive"
  | "token"
  | "markdown"
  | "latex"
  | "python"
  | "javascript"
  | "html";

const languages = {
  python: "python",
  javascript: "js",
  html: "html",
} as const;

export type Strategy = {
  id: string;
  method: Method;
  size: number;
  overlap: number;
};

export const methods: Record<
  Method,
  { label: string; description: string; unit: string }
> = {
  character: {
    label: "Character",
    description:
      "Fixed-size character windows; LangChain trims boundary whitespace.",
    unit: "characters",
  },
  paragraph: {
    label: "Paragraph",
    description:
      "Packs blank-line-separated paragraphs; a whole paragraph may exceed the size target.",
    unit: "characters",
  },
  line: {
    label: "Line",
    description:
      "Packs whole lines, useful for logs; a single line may exceed the size target.",
    unit: "characters",
  },
  recursive: {
    label: "Recursive",
    description:
      "Splits on paragraphs, lines, and words before falling back to characters.",
    unit: "characters",
  },
  token: {
    label: "Token",
    description:
      "GPT-2 token windows; decoding may split Unicode characters across chunks.",
    unit: "tokens",
  },
  markdown: {
    label: "Markdown",
    description:
      "Recursive splitting using Markdown headings and formatting boundaries.",
    unit: "characters",
  },
  latex: {
    label: "LaTeX",
    description:
      "Recursive splitting using LaTeX sections and environment boundaries.",
    unit: "characters",
  },
  python: {
    label: "Python",
    description:
      "Recursive splitting using Python class and function boundaries; not a syntax parser.",
    unit: "characters",
  },
  javascript: {
    label: "JavaScript",
    description:
      "Recursive splitting using JavaScript function and control-flow boundaries; not a syntax parser.",
    unit: "characters",
  },
  html: {
    label: "HTML",
    description:
      "Recursive splitting at HTML tag boundaries; preserves raw markup, not rendered text.",
    unit: "characters",
  },
};

export type ResultChunk = {
  text: string;
  /** Exact UTF-16 source offsets, end-exclusive; null when mapping is uncertain. */
  start: number | null;
  end: number | null;
  /** Source intersection with the previous chunk, in UTF-16 units; 0 if unknown. */
  overlap: number;
};

function splitterOptions(strategy: Strategy) {
  if (!Object.prototype.hasOwnProperty.call(methods, strategy.method)) {
    throw new RangeError(`Unknown chunking method: ${strategy.method}`);
  }
  if (!Number.isSafeInteger(strategy.size) || strategy.size <= 0) {
    throw new RangeError("Chunk size must be a positive safe integer.");
  }
  if (
    !Number.isSafeInteger(strategy.overlap) ||
    strategy.overlap < 0 ||
    strategy.overlap >= strategy.size
  ) {
    throw new RangeError(
      "Chunk overlap must be an integer >= 0 and smaller than chunk size.",
    );
  }
  return {
    chunkSize: strategy.size,
    chunkOverlap: strategy.overlap,
    ...(strategy.method === "character" ? { separator: "" } : {}),
    ...(strategy.method === "paragraph"
      ? { separator: "\n\n", keepSeparator: true }
      : {}),
    ...(strategy.method === "line"
      ? { separator: "\n", keepSeparator: true }
      : {}),
    ...(strategy.method === "token" ? { encodingName: "gpt2" as const } : {}),
  };
}

export async function splitStrategy(
  text: string,
  strategy: Strategy,
): Promise<ResultChunk[]> {
  const options = splitterOptions(strategy);
  if (text.length === 0) return [];
  const {
    CharacterTextSplitter,
    RecursiveCharacterTextSplitter,
    TokenTextSplitter,
    MarkdownTextSplitter,
    LatexTextSplitter,
  } = await import("langchain/text_splitter");
  const splitters = {
    character: CharacterTextSplitter,
    paragraph: CharacterTextSplitter,
    line: CharacterTextSplitter,
    recursive: RecursiveCharacterTextSplitter,
    token: TokenTextSplitter,
    markdown: MarkdownTextSplitter,
    latex: LatexTextSplitter,
    python: RecursiveCharacterTextSplitter,
    javascript: RecursiveCharacterTextSplitter,
    html: RecursiveCharacterTextSplitter,
  };
  const language = languages[strategy.method as keyof typeof languages];
  const splitter = language
    ? RecursiveCharacterTextSplitter.fromLanguage(language, options)
    : new splitters[strategy.method](options);
  const chunks = await splitter.splitText(text);
  if (chunks.length > 10_000) {
    throw new RangeError(
      "This configuration produces more than 10,000 chunks. Increase chunk size, reduce overlap, or shorten the source.",
    );
  }
  const results: ResultChunk[] = [];
  for (const chunk of chunks) {
    const index = chunk.length > 0 ? text.indexOf(chunk) : -1;
    // Do not guess which occurrence produced repeated text, including overlapping matches.
    const start =
      index >= 0 && text.indexOf(chunk, index + 1) === -1 ? index : null;
    const end = start === null ? null : start + chunk.length;
    const previous = results[results.length - 1];
    const overlap =
      start !== null &&
      end !== null &&
      previous?.start != null &&
      previous.end !== null
        ? Math.max(
            0,
            Math.min(end, previous.end) - Math.max(start, previous.start),
          )
        : 0;
    results.push({ text: chunk, start, end, overlap });
  }
  return results;
}

export function exampleCode(strategy: Strategy): string {
  const options = splitterOptions(strategy);
  // Explicit names keep snippets valid in minified production builds.
  const name = {
    character: "CharacterTextSplitter",
    paragraph: "CharacterTextSplitter",
    line: "CharacterTextSplitter",
    recursive: "RecursiveCharacterTextSplitter",
    token: "TokenTextSplitter",
    markdown: "MarkdownTextSplitter",
    latex: "LatexTextSplitter",
    python: "RecursiveCharacterTextSplitter",
    javascript: "RecursiveCharacterTextSplitter",
    html: "RecursiveCharacterTextSplitter",
  }[strategy.method];
  const language = languages[strategy.method as keyof typeof languages];
  const constructor = language
    ? `${name}.fromLanguage(${JSON.stringify(language)}, ${JSON.stringify(options, null, 2)})`
    : `new ${name}(${JSON.stringify(options, null, 2)})`;
  return `import { ${name} } from "langchain/text_splitter";\n\nconst text = "Your text to split";\nconst splitter = ${constructor};\nconst chunks = await splitter.splitText(text);`;
}
