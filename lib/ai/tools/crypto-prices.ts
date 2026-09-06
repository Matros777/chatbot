import { tool } from "ai";
import { z } from "zod";

const COINS: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  xrp: "ripple",
  ada: "cardano",
  doge: "dogecoin",
  dot: "polkadot",
  avalanche: "avalanche-2",
  ltc: "litecoin",
  bnb: "binancecoin",
};

export const cryptoPrices = tool({
  description:
    "Get current cryptocurrency prices in USD with 24h change. Supported: btc, eth, sol, xrp, ada, doge, dot, avalanche, ltc, bnb.",
  inputSchema: z.object({
    coins: z.array(z.string()).describe("List of coin symbols, e.g. ['btc', 'eth', 'sol']"),
  }),
  execute: async ({ coins }) => {
    try {
      const ids = coins
        .map((c) => c.toLowerCase())
        .map((c) => COINS[c] || c)
        .join(",");

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      }

      const data = await res.json() as Record<string, { usd?: number; usd_24h_change?: number }>;
      const prices = Object.entries(data).map(([id, val]) => ({
        coin: id,
        symbol: Object.keys(COINS).find((k) => COINS[k] === id) || id,
        priceUsd: val.usd,
        change24h: val.usd_24h_change?.toFixed(2),
      }));

      return { success: true, prices };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to fetch prices: ${msg}` };
    }
  },
});