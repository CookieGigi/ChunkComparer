import { useEffect, useRef, useState } from "react";
import {
  exampleCode,
  methods,
  type Method,
  type ResultChunk,
  type Strategy,
} from "./chunking";
import { samples } from "./samples";
import DocumentText from "./DocumentText";
import styles from "./App.module.css";

type Result = { id: string; chunks: ResultChunk[]; error?: string };
const initial: Strategy[] = [
  { id: "recursive", method: "recursive", size: 500, overlap: 50 },
  { id: "token", method: "token", size: 150, overlap: 20 },
];
const number = (value: number) => value.toLocaleString();

export default function App() {
  const [text, setText] = useState(samples.prose);
  const [strategies, setStrategies] = useState(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState("Updating");
  const [view, setView] = useState<"document" | "chunks">("document");
  const [tab, setTab] = useState("results");
  const [visible, setVisible] = useState(["recursive", "token"]);
  const [selected, setSelected] = useState<{
    id: string;
    index: number;
  } | null>(null);
  const [linked, setLinked] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [notice, setNotice] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [renderLimit, setRenderLimit] = useState(200);
  const upload = useRef<HTMLInputElement>(null);
  const panes = useRef<Record<string, HTMLDivElement | null>>({});
  const revision = useRef(0);

  useEffect(() => {
    const version = ++revision.current;
    setStatus("Updating");
    setSelected(null);
    setRenderLimit(200);
    setResults([]);
    let worker: Worker | undefined;
    const timer = window.setTimeout(() => {
      worker = new Worker(new URL("./chunking.worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (event: MessageEvent<Result[]>) => {
        if (version !== revision.current) return;
        setResults(event.data);
        setStatus(
          event.data.some((result) => result.error)
            ? "Check strategies"
            : "Up to date",
        );
        worker?.terminate();
      };
      worker.onerror = () => {
        if (version !== revision.current) return;
        setStatus("Failed");
        setNotice(
          "Could not process this document. Try a smaller input or reload the page.",
        );
      };
      worker.postMessage({ text, strategies });
    }, 350);
    return () => {
      window.clearTimeout(timer);
      worker?.terminate();
    };
  }, [text, strategies]);

  function update(id: string, patch: Partial<Strategy>) {
    setStrategies((current) =>
      current.map((strategy) =>
        strategy.id === id ? { ...strategy, ...patch } : strategy,
      ),
    );
  }

  function chooseChunk(id: string, index: number) {
    setSelected({ id, index });
    setRenderLimit((current) => Math.max(current, index + 1));
  }

  useEffect(() => {
    if (!selected) return;
    const chunk = results.find((result) => result.id === selected.id)?.chunks[
      selected.index
    ];
    if (!chunk) return;
    for (const result of results) {
      if (!visible.includes(result.id)) continue;
      if (result.id !== selected.id && (!linked || chunk.start === null))
        continue;
      const match =
        result.id === selected.id
          ? selected.index
          : result.chunks.findIndex(
              (other) =>
                other.start !== null &&
                other.end !== null &&
                other.start <= chunk.start! &&
                other.end > chunk.start!,
            );
      if (match < 0) continue;
      if (match >= renderLimit) {
        setRenderLimit(match + 1);
        continue;
      }
      const pane = panes.current[result.id];
      const target = pane?.querySelector<HTMLElement>(
        `[data-chunk="${match}"]`,
      );
      if (pane && target)
        pane.scrollTo({
          top: target.offsetTop - 16,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
    }
  }, [selected, linked, results, visible, view, renderLimit, tab]);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Copied to clipboard.");
    } catch {
      setNotice(
        "Clipboard access unavailable. You can select and copy the text directly.",
      );
    }
  }

  function exportResults() {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              source: text,
              strategies,
              results,
              offsetUnit: "UTF-16 code units",
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "chunk-comparison.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const activeResult = results.find((result) => result.id === selected?.id);
  const activeChunk = selected
    ? activeResult?.chunks[selected.index]
    : undefined;
  const activeStrategy = strategies.find(
    (strategy) => strategy.id === selected?.id,
  );
  const ready = status === "Up to date";

  return (
    <div className={styles.app}>
      <a href="#workspace" className={styles.skip}>
        Skip to comparison
      </a>
      <header className={styles.header}>
        <a className={styles.brand} href="./" aria-label="Chunk comparer home">
          <span className={styles.logo} aria-hidden="true">
            ▥
          </span>{" "}
          chunk<span className={styles.brandLight}>/comparer</span>
          <span className={styles.badge}>WORKBENCH</span>
        </a>
        <div className={styles.headerActions}>
          <span className={styles.local}>
            Local processing. Your text stays here.
          </span>
          <button onClick={() => upload.current?.click()}>Import text</button>
          <button
            className={styles.primary}
            onClick={exportResults}
            disabled={!ready || !text || !strategies.length}
          >
            Export JSON <span aria-hidden="true">↗</span>
          </button>
          <input
            hidden
            ref={upload}
            type="file"
            accept=".txt,.md,.tex,.csv,.json,text/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              if (file.size > 2_000_000) {
                setNotice("Choose a text file smaller than 2 MB.");
                return;
              }
              try {
                setText(await file.text());
                setNotice(`Imported ${file.name}.`);
              } catch {
                setNotice("The file could not be read.");
              }
            }}
          />
        </div>
      </header>

      <nav className={styles.mobileTabs} aria-label="Workspace sections">
        {["source", "strategies", "results"].map((item) => (
          <button
            key={item}
            aria-pressed={tab === item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div
        className={`${styles.layout} ${collapsed ? styles.railCollapsed : ""}`}
      >
        <aside
          className={`${styles.rail} ${tab === "results" ? styles.mobileHidden : ""}`}
          aria-label="Experiment setup"
        >
          <section
            className={`${styles.sourceSection} ${tab === "strategies" ? styles.mobileHidden : ""}`}
          >
            <div className={styles.sectionHeading}>
              <h2>
                <span>01</span> Source text
              </h2>
              <button className={styles.textButton} onClick={() => setText("")}>
                Clear
              </button>
            </div>
            <p className={styles.description}>
              One document. Different perspectives.
            </p>
            <label className={styles.sampleLabel}>
              Load example
              <select
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value)
                    setText(
                      samples[event.target.value as keyof typeof samples],
                    );
                  event.target.value = "";
                }}
              >
                <option value="" disabled>
                  Choose a sample...
                </option>
                <option value="prose">Prose / The art of chunking</option>
                <option value="markdown">Markdown / Field notes</option>
                <option value="latex">LaTeX / Research abstract</option>
              </select>
            </label>
            <label className={styles.srOnly} htmlFor="source">
              Source text
            </label>
            <textarea
              id="source"
              spellCheck={false}
              value={text}
              maxLength={2_000_000}
              placeholder="Paste your document here, or load an example above."
              onChange={(event) => setText(event.target.value)}
            />
            <div className={styles.sourceFooter}>
              <span>{number(text.length)} UTF-16 units</span>
              <span>Plain text</span>
            </div>
          </section>

          <section
            className={`${styles.strategySection} ${tab === "source" ? styles.mobileHidden : ""}`}
          >
            <div className={styles.sectionHeading}>
              <h2>
                <span>02</span> Strategies
              </h2>
              <span className={styles.count}>{strategies.length}</span>
            </div>
            <p className={styles.description}>
              Tune the boundaries. Compare the trade-offs.
            </p>
            {strategies.map((strategy, index) => (
              <article className={styles.strategy} key={strategy.id}>
                <div className={styles.strategyTitle}>
                  <span className={styles.strategyIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <label
                    className={styles.srOnly}
                    htmlFor={`method-${strategy.id}`}
                  >
                    Method for strategy {index + 1}
                  </label>
                  <select
                    id={`method-${strategy.id}`}
                    value={strategy.method}
                    onChange={(event) =>
                      update(strategy.id, {
                        method: event.target.value as Method,
                      })
                    }
                  >
                    {Object.entries(methods).map(([key, method]) => (
                      <option key={key} value={key}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className={styles.remove}
                    aria-label={`Remove strategy ${index + 1}`}
                    onClick={() => {
                      setStrategies((current) =>
                        current.filter((item) => item.id !== strategy.id),
                      );
                      setVisible((current) =>
                        current.filter((id) => id !== strategy.id),
                      );
                    }}
                  >
                    ×
                  </button>
                </div>
                <p>{methods[strategy.method].description}</p>
                <div className={styles.fields}>
                  <label>
                    Chunk size
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={Number.isNaN(strategy.size) ? "" : strategy.size}
                      onChange={(event) =>
                        update(strategy.id, {
                          size: event.target.valueAsNumber,
                        })
                      }
                    />
                  </label>
                  <label>
                    Overlap
                    <input
                      type="number"
                      min="0"
                      max={strategy.size - 1}
                      step="1"
                      value={
                        Number.isNaN(strategy.overlap) ? "" : strategy.overlap
                      }
                      onChange={(event) =>
                        update(strategy.id, {
                          overlap: event.target.valueAsNumber,
                        })
                      }
                    />
                  </label>
                </div>
                <div className={styles.unit}>
                  {methods[strategy.method].unit}
                  {strategy.method === "token"
                    ? " · GPT-2 encoding"
                    : " · UTF-16 units"}
                </div>
                {results.find((result) => result.id === strategy.id)?.error && (
                  <p className={styles.configError}>
                    {results.find((result) => result.id === strategy.id)?.error}
                  </p>
                )}
              </article>
            ))}
            <button
              className={styles.add}
              disabled={strategies.length >= 6}
              onClick={() => {
                const id = crypto.randomUUID();
                setStrategies((current) => [
                  ...current,
                  { id, method: "recursive", size: 500, overlap: 50 },
                ]);
                setVisible((current) =>
                  current.length < 2 ? [...current, id] : current,
                );
              }}
            >
              + Add strategy <span>{strategies.length}/6</span>
            </button>
          </section>
          <div className={styles.railNote}>
            Different units are different budgets.
            <br />
            500 tokens is not 500 characters.
          </div>
        </aside>

        <main
          id="workspace"
          className={`${styles.workspace} ${tab !== "results" ? styles.mobileHidden : ""}`}
        >
          <div className={styles.workspaceHeading}>
            <div>
              <div className={styles.eyebrow}>
                THE BOUNDARIES MAKE THE DIFFERENCE
              </div>
              <h1>A closer look at your chunks.</h1>
              <p>Compare how each strategy sees the same text.</p>
            </div>
            <button
              className={styles.collapse}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Show setup" : "Hide setup"}
            </button>
          </div>
          <div className={styles.toolbar}>
            <div
              className={styles.segment}
              role="group"
              aria-label="Result view"
            >
              {(["document", "chunks"] as const).map((mode) => (
                <button
                  key={mode}
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                >
                  {mode === "document" ? "Document" : "Chunks"}
                </button>
              ))}
            </div>
            <label className={styles.linked}>
              <input
                type="checkbox"
                checked={linked}
                onChange={(event) => setLinked(event.target.checked)}
              />
              Link selection
            </label>
            <div className={styles.zoom}>
              <button
                aria-label="Decrease text size"
                disabled={zoom <= 80}
                onClick={() => setZoom(zoom - 10)}
              >
                −
              </button>
              <button aria-label="Reset text size" onClick={() => setZoom(100)}>
                {zoom}%
              </button>
              <button
                aria-label="Increase text size"
                disabled={zoom >= 150}
                onClick={() => setZoom(zoom + 10)}
              >
                +
              </button>
            </div>
            <span className={styles.status} role="status">
              <span
                className={
                  status === "Updating" ? styles.pendingDot : styles.statusDot
                }
              />
              {status}
            </span>
          </div>

          <div className={styles.comparison}>
            {[0, 1].map((slot) => {
              const strategy = strategies.find(
                (item) => item.id === visible[slot],
              );
              const result = results.find((item) => item.id === strategy?.id);
              const chunks = result?.chunks ?? [];
              const lengths = chunks.map((chunk) => chunk.text.length);
              const minLength = lengths.reduce(
                (min, length) => Math.min(min, length),
                Infinity,
              );
              const maxLength = lengths.reduce(
                (max, length) => Math.max(max, length),
                0,
              );
              return (
                <section
                  className={styles.pane}
                  key={slot}
                  aria-label={`Comparison ${slot + 1}`}
                >
                  <div className={styles.paneHeader}>
                    <div className={styles.paneTitle}>
                      <span className={styles.paneLetter}>
                        {slot === 0 ? "A" : "B"}
                      </span>
                      <select
                        aria-label={`Strategy in pane ${slot === 0 ? "A" : "B"}`}
                        value={strategy?.id ?? ""}
                        onChange={(event) =>
                          setVisible((current) => {
                            const next = [...current];
                            if (next[1 - slot] === event.target.value)
                              next[1 - slot] = next[slot];
                            next[slot] = event.target.value;
                            return next;
                          })
                        }
                      >
                        <option value="">Choose a strategy</option>
                        {strategies.map((item, index) => (
                          <option key={item.id} value={item.id}>
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {methods[item.method].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p>
                      {strategy
                        ? `${Number.isFinite(strategy.size) ? strategy.size : "—"} ${methods[strategy.method].unit} / ${Number.isFinite(strategy.overlap) ? strategy.overlap : "—"} overlap`
                        : "Add a strategy to begin"}
                    </p>
                    <div className={styles.metrics}>
                      <div>
                        <strong>
                          {result && !result.error ? chunks.length : "—"}
                        </strong>
                        <span>chunks</span>
                      </div>
                      <div>
                        <strong>
                          {lengths.length
                            ? number(
                                Math.round(
                                  lengths.reduce((a, b) => a + b, 0) /
                                    lengths.length,
                                ),
                              )
                            : "—"}
                        </strong>
                        <span>avg. UTF-16 units</span>
                      </div>
                      <div
                        className={styles.distribution}
                        role="img"
                        aria-label={`Relative sizes of the first ${Math.min(60, lengths.length)} chunks`}
                      >
                        {lengths.slice(0, 60).map((length, index) => (
                          <i
                            key={index}
                            style={{
                              height: `${Math.max(5, (length / Math.max(...lengths.slice(0, 60))) * 30)}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.paneBody} ${view === "chunks" ? styles.chunkView : ""}`}
                    style={{ fontSize: `${zoom * 0.14}px` }}
                    ref={(element) => {
                      if (strategy) panes.current[strategy.id] = element;
                    }}
                    aria-busy={status === "Updating"}
                  >
                    {!strategy ? (
                      <div className={styles.empty}>
                        <span>↖</span>
                        <h3>Another perspective</h3>
                        <p>
                          Choose a strategy above to compare its boundaries.
                        </p>
                      </div>
                    ) : status === "Updating" ? (
                      <div className={styles.empty}>
                        <h3>Finding the boundaries...</h3>
                        <p>Processing locally in your browser.</p>
                      </div>
                    ) : result?.error ? (
                      <div className={styles.empty} role="alert">
                        <h3>Check this configuration</h3>
                        <p>{result.error}</p>
                      </div>
                    ) : !chunks.length ? (
                      <div className={styles.empty}>
                        <h3>
                          {status === "Failed"
                            ? "Processing failed"
                            : "A blank canvas"}
                        </h3>
                        <p>
                          {status === "Failed"
                            ? "Try another document or reload to retry."
                            : "Paste some text or load a sample to see its chunks."}
                        </p>
                      </div>
                    ) : view === "document" ? (
                      <DocumentText
                        text={text}
                        chunks={chunks}
                        limit={renderLimit}
                        selectedIndex={
                          selected?.id === strategy.id
                            ? selected.index
                            : undefined
                        }
                        onSelect={(index) => chooseChunk(strategy.id, index)}
                      />
                    ) : (
                      chunks.slice(0, renderLimit).map((chunk, index) => (
                        <article
                          data-chunk={index}
                          className={`${styles.chunk} ${selected?.id === strategy.id && selected.index === index ? styles.selected : ""}`}
                          key={index}
                        >
                          <button
                            className={styles.chunkBoundary}
                            aria-pressed={
                              selected?.id === strategy.id &&
                              selected.index === index
                            }
                            onClick={() => chooseChunk(strategy.id, index)}
                          >
                            <span>
                              CHUNK {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>
                              {number(chunk.text.length)} units{" "}
                              {chunk.overlap > 0
                                ? ` / ${chunk.overlap} overlap`
                                : ""}
                              <span aria-hidden="true"> ↗</span>
                            </span>
                          </button>
                          <div className={styles.chunkText}>
                            {chunk.overlap > 0 && (
                              <mark title="Verified overlap with the preceding chunk">
                                {chunk.text.slice(0, chunk.overlap)}
                              </mark>
                            )}
                            {chunk.text.slice(chunk.overlap)}
                          </div>
                        </article>
                      ))
                    )}
                    {chunks.length > renderLimit && (
                      <button
                        className={styles.loadMore}
                        onClick={() =>
                          setRenderLimit((current) => current + 200)
                        }
                      >
                        Showing {renderLimit} of {number(chunks.length)} chunks.
                        Load 200 more
                      </button>
                    )}
                  </div>
                  <div className={styles.paneFooter}>
                    {chunks.length
                      ? `${number(minLength)}–${number(maxLength)} units / chunk`
                      : "No results yet"}
                    <span>UTF-16 lengths</span>
                  </div>
                </section>
              );
            })}
          </div>
          <div className={styles.legend}>
            <span>
              <i />
              {view === "document" ? "Chunk highlight" : "Chunk boundary"}
            </span>
            <span>
              <i className={styles.overlapSwatch} />
              Verified overlap
            </span>
            <p>
              {view === "document"
                ? "Select highlighted text to inspect its chunk and link its source position."
                : "Select a chunk label to inspect it and link its source position."}
            </p>
          </div>
          <section className={styles.inspector} aria-label="Chunk inspector">
            <div className={styles.inspectorHeading}>
              <h2>Chunk inspector</h2>
              {activeChunk && selected && (
                <div className={styles.inspectorActions}>
                  <button
                    disabled={selected.index === 0}
                    onClick={() => chooseChunk(selected.id, selected.index - 1)}
                  >
                    Previous
                  </button>
                  <button
                    disabled={
                      selected.index >= (activeResult?.chunks.length ?? 0) - 1
                    }
                    onClick={() => chooseChunk(selected.id, selected.index + 1)}
                  >
                    Next
                  </button>
                  <button onClick={() => copy(activeChunk.text)}>
                    Copy chunk
                  </button>
                </div>
              )}
            </div>
            {activeChunk && activeStrategy && selected ? (
              <>
                <div className={styles.inspectorMeta}>
                  <strong>
                    {methods[activeStrategy.method].label} /{" "}
                    {String(selected.index + 1).padStart(2, "0")}
                  </strong>
                  <span>{number(activeChunk.text.length)} UTF-16 units</span>
                  <span>
                    {activeChunk.start === null
                      ? "Exact source position unavailable"
                      : `Source [${activeChunk.start}, ${activeChunk.end})`}
                  </span>
                  <span>
                    {activeChunk.start === null ||
                    (selected.index > 0 &&
                      activeResult?.chunks[selected.index - 1].start === null)
                      ? "Overlap unknown"
                      : `${activeChunk.overlap} units overlap`}
                  </span>
                </div>
                <pre className={styles.inspectorText}>{activeChunk.text}</pre>
                <details>
                  <summary>Reproduce this strategy in code</summary>
                  <button onClick={() => copy(exampleCode(activeStrategy))}>
                    Copy code
                  </button>
                  <pre className={styles.code}>
                    {exampleCode(activeStrategy)}
                  </pre>
                </details>
              </>
            ) : (
              <p className={styles.inspectorEmpty}>
                Every split tells a story. Select a chunk to explore its text,
                source range, and overlap.
              </p>
            )}
          </section>
          <footer className={styles.footer}>
            <span>Built for exploration, not a quality ranking.</span>
            <span>Native splitter output · whitespace may be trimmed</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className={styles.notice} role="status">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
