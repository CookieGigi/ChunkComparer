import { Fragment } from "react";
import type { ResultChunk } from "./chunking";
import styles from "./App.module.css";

export default function DocumentText({
  text,
  chunks,
  limit,
  selectedIndex,
  onSelect,
}: {
  text: string;
  chunks: ResultChunk[];
  limit: number;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}) {
  const mapped = chunks.every(
    (chunk, index) =>
      chunk.start !== null &&
      chunk.end !== null &&
      (index === 0 ||
        (chunk.start >= chunks[index - 1].start! &&
          chunk.end >= chunks[index - 1].end!)),
  );

  return (
    <div className={styles.documentText}>
      {chunks.slice(0, limit).map((chunk, index) => {
        const previousEnd = index === 0 ? 0 : chunks[index - 1].end!;
        // Show the source once when ranges are known, retaining whitespace omitted by splitters.
        const content = mapped
          ? text.slice(Math.max(previousEnd, chunk.start!), chunk.end!)
          : chunk.text;
        const next = chunks[index + 1];
        const shared =
          mapped && next
            ? Math.min(content.length, Math.max(0, chunk.end! - next.start!))
            : 0;
        return (
          <Fragment key={index}>
            {mapped
              ? text.slice(previousEnd, Math.max(previousEnd, chunk.start!))
              : index > 0
                ? "\n"
                : ""}
            <span
              data-chunk={index}
              className={`${styles.inlineChunk} ${selectedIndex === index ? styles.inlineSelected : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedIndex === index}
              aria-label={`Inspect chunk ${index + 1}, ${chunk.text.length} UTF-16 units`}
              title={`Chunk ${index + 1} / ${chunk.text.length} UTF-16 units`}
              onClick={() => {
                if (!window.getSelection()?.toString()) onSelect(index);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
              }}
            >
              {content.slice(0, content.length - shared)}
              {shared > 0 && (
                <mark title="Verified overlap with the next chunk">
                  {content.slice(content.length - shared)}
                </mark>
              )}
            </span>
          </Fragment>
        );
      })}
      {mapped &&
        chunks.length <= limit &&
        text.slice(chunks[chunks.length - 1].end!)}
    </div>
  );
}
