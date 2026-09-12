import { splitStrategy, type Strategy } from "./chunking";

self.onmessage = async (
  event: MessageEvent<{ text: string; strategies: Strategy[] }>,
) => {
  const { text, strategies } = event.data;
  const results = await Promise.all(
    strategies.map(async (strategy) => {
      try {
        return { id: strategy.id, chunks: await splitStrategy(text, strategy) };
      } catch (error) {
        return {
          id: strategy.id,
          chunks: [],
          error: error instanceof Error ? error.message : "Splitting failed.",
        };
      }
    }),
  );
  self.postMessage(results);
};
