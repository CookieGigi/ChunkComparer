// @ts-ignore Node supplies this module; the browser project does not install @types/node.
import assert from "node:assert/strict";
// @ts-ignore Node supplies this module; the browser project does not install @types/node.
import test from "node:test";
import {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
  MarkdownTextSplitter,
  LatexTextSplitter,
} from "langchain/text_splitter";
import { exampleCode, methods, splitStrategy } from "./chunking.ts";
import type { Method, Strategy } from "./chunking.ts";

const strategy: Strategy = {
  id: "test",
  method: "character",
  size: 5,
  overlap: 2,
};

test("validates size and overlap even for empty input and generated examples", async () => {
  for (const size of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(splitStrategy("", { ...strategy, size }), RangeError);
    assert.throws(() => exampleCode({ ...strategy, size }), RangeError);
  }
  for (const overlap of [-1, 0.5, 5, 6, NaN, Infinity]) {
    await assert.rejects(
      splitStrategy("", { ...strategy, overlap }),
      RangeError,
    );
    assert.throws(() => exampleCode({ ...strategy, overlap }), RangeError);
  }
  for (const method of ["unknown", "constructor", "__proto__"]) {
    const invalid = { ...strategy, method: method as Method };
    await assert.rejects(splitStrategy("text", invalid), RangeError);
    assert.throws(() => exampleCode(invalid), RangeError);
  }
});

test("maps exact character windows and actual overlap", async () => {
  assert.deepEqual(await splitStrategy("abcdefghijk", strategy), [
    { text: "abcde", start: 0, end: 5, overlap: 0 },
    { text: "defgh", start: 3, end: 8, overlap: 2 },
    { text: "ghijk", start: 6, end: 11, overlap: 2 },
  ]);
});

test("boundary trimming does not fabricate configured overlap", async () => {
  assert.deepEqual(await splitStrategy("abc  def", strategy), [
    { text: "abc", start: 0, end: 3, overlap: 0 },
    { text: "def", start: 5, end: 8, overlap: 0 },
  ]);
});

test("ambiguous repeated text, including overlapping occurrences, stays unmapped", async () => {
  for (const text of ["abcabcabc", "aaaaaaaa"]) {
    const chunks = await splitStrategy(text, {
      ...strategy,
      size: 3,
      overlap: 0,
    });
    assert.ok(chunks.length > 1);
    for (const chunk of chunks) {
      assert.equal(chunk.start, null);
      assert.equal(chunk.end, null);
      assert.equal(chunk.overlap, 0);
    }
  }
});

test("a mapped chunk following an ambiguous chunk has no inferred overlap", async () => {
  assert.deepEqual(
    await splitStrategy("abcabcXYZ", { ...strategy, size: 3, overlap: 0 }),
    [
      { text: "abc", start: null, end: null, overlap: 0 },
      { text: "abc", start: null, end: null, overlap: 0 },
      { text: "XYZ", start: 6, end: 9, overlap: 0 },
    ],
  );
});

const constructors = {
  character: CharacterTextSplitter,
  recursive: RecursiveCharacterTextSplitter,
  token: TokenTextSplitter,
  markdown: MarkdownTextSplitter,
  latex: LatexTextSplitter,
};

for (const method of Object.keys(methods) as Method[]) {
  test(`${method} preserves native splitter output and emits executable equivalent examples`, async () => {
    const config = { ...strategy, method, size: 32, overlap: 7 };
    const input =
      "  # First heading\n\nAlpha beta gamma delta epsilon.\n\n## Next\n\n```ts\nconst n = 1;\n```\n\\section{Details}\nA different paragraph with unique words.  ";
    const options = {
      chunkSize: config.size,
      chunkOverlap: config.overlap,
      ...(method === "character" ? { separator: "" } : {}),
      ...(method === "token" ? { encodingName: "gpt2" as const } : {}),
    };
    const expected = await new constructors[method](options).splitText(input);
    const actual = await splitStrategy(input, config);
    assert.deepEqual(
      actual.map((chunk) => chunk.text),
      expected,
    );
    for (const [index, chunk] of actual.entries()) {
      if (chunk.start === null || chunk.end === null) {
        assert.equal(chunk.start, null);
        assert.equal(chunk.end, null);
        assert.equal(chunk.overlap, 0);
        continue;
      }
      assert.equal(input.slice(chunk.start, chunk.end), chunk.text);
      const prev = actual[index - 1];
      assert.equal(
        chunk.overlap,
        prev?.start != null && prev.end !== null
          ? Math.max(
              0,
              Math.min(chunk.end, prev.end) - Math.max(chunk.start, prev.start),
            )
          : 0,
      );
    }
    const code = exampleCode(config)
      .replace('"Your text to split"', JSON.stringify(input))
      .replace(
        /^import \{ (\w+) \} from "langchain\/text_splitter";/,
        "const { $1 } = await loadSplitters();",
      );
    const execute = new Function(
      "loadSplitters",
      `return (async () => { ${code}\nreturn chunks; })();`,
    );
    assert.deepEqual(
      await execute(() => import("langchain/text_splitter")),
      expected,
    );
    assert.deepEqual(await splitStrategy("", config), []);
  });
}

test("token overlap is measured in source characters, not tokens", async () => {
  const chunks = await splitStrategy(
    "The quick brown fox jumps over the lazy dog.",
    {
      ...strategy,
      method: "token",
      size: 4,
      overlap: 1,
    },
  );
  assert.ok(chunks.some((chunk) => chunk.overlap > 1));
  for (const chunk of chunks) assert.notEqual(chunk.start, null);
});

test("token decoding that cannot be matched is preserved without invented offsets", async () => {
  const input = "\u{1f600}\u{1f680}\u6f22\u5b57";
  const config = { ...strategy, method: "token" as const, size: 1, overlap: 0 };
  const chunks = await splitStrategy(input, config);
  const expected = await new TokenTextSplitter({
    chunkSize: 1,
    chunkOverlap: 0,
    encodingName: "gpt2",
  }).splitText(input);
  assert.deepEqual(
    chunks.map((chunk) => chunk.text),
    expected,
  );
  assert.ok(chunks.some((chunk) => !input.includes(chunk.text)));
  for (const chunk of chunks.filter((chunk) => !input.includes(chunk.text))) {
    assert.equal(chunk.start, null);
    assert.equal(chunk.end, null);
    assert.equal(chunk.overlap, 0);
  }
});

test("whitespace-only character input is trimmed and minimum size terminates", async () => {
  assert.deepEqual(await splitStrategy(" \n\t ", strategy), []);
  assert.deepEqual(
    await splitStrategy("ab", { ...strategy, size: 1, overlap: 0 }),
    [
      { text: "a", start: 0, end: 1, overlap: 0 },
      { text: "b", start: 1, end: 2, overlap: 0 },
    ],
  );
});

test("rejects result sets too large for interactive inspection", async () => {
  await assert.rejects(
    splitStrategy("a".repeat(10_001), { ...strategy, size: 1, overlap: 0 }),
    /more than 10,000 chunks/,
  );
});
