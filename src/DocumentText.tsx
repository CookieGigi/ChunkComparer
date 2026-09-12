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
  const selected = selectedIndex === undefined ? undefined : chunks[selectedIndex];

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
        const contentStart = mapped ? Math.max(previousEnd, chunk.start!) : 0;
        // Overlap may be displayed in earlier spans, but still belongs to the selected chunk.
        const selectionStart =
          mapped && selected
            ? Math.max(0, Math.min(content.length, selected.start! - contentStart))
            : 0;
        const selectionEnd =
          mapped && selected
            ? Math.max(0, Math.min(content.length, selected.end! - contentStart))
            : selectedIndex === index
              ? content.length
              : 0;
        const renderContent = (start: number, end: number) => {
          const overlapStart = content.length - shared;
          return (
            <>
              {content.slice(start, Math.min(end, Math.max(start, overlapStart)))}
              {end > Math.max(start, overlapStart) && (
                <mark title="Verified overlap with the next chunk">
                  {content.slice(Math.max(start, overlapStart), end)}
                </mark>
              )}
            </>
          );
        };
        return (
          <Fragment key={index}>
            {mapped
              ? text.slice(previousEnd, Math.max(previousEnd, chunk.start!))
              : index > 0
                ? "\n"
                : ""}
            <span
              data-chunk={index}
              className={styles.inlineChunk}
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
              {renderContent(0, selectionStart)}
              {selectionEnd > selectionStart && (
                <span className={styles.inlineSelected}>
                  {renderContent(selectionStart, selectionEnd)}
                </span>
              )}
              {renderContent(Math.max(selectionStart, selectionEnd), content.length)}
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
