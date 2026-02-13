import type { AddressInfo, BlockstreamTx } from "./types";

const API_PROVIDERS = [
  "https://mempool.space/api",
  "https://blockstream.info/api",
];

const HEADERS: HeadersInit = {
  "User-Agent": "howismybitcoindoing/1.0",
  Accept: "application/json",
};

async function apiFetch(path: string): Promise<Response> {
  let lastError: unknown;

  for (const base of API_PROVIDERS) {
    try {
      const res = await fetch(`${base}${path}`, { headers: HEADERS });
      if (res.ok || res.status === 400) return res;
    } catch (err) {
      lastError = err;
      // Try next provider
    }
  }

  throw lastError ?? new Error("All API providers failed");
}

export async function fetchAddressInfo(address: string): Promise<AddressInfo> {
  const res = await apiFetch(`/address/${address}`);
  if (!res.ok) {
    if (res.status === 400) throw new Error("Invalid Bitcoin address");
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchAllTransactions(
  address: string
): Promise<BlockstreamTx[]> {
  const allTxs: BlockstreamTx[] = [];
  let lastTxid: string | undefined;

  while (true) {
    const path = lastTxid
      ? `/address/${address}/txs/chain/${lastTxid}`
      : `/address/${address}/txs`;

    const res = await apiFetch(path);
    if (!res.ok) {
      throw new Error(`Failed to fetch transactions: ${res.status}`);
    }

    const txs: BlockstreamTx[] = await res.json();
    if (txs.length === 0) break;

    allTxs.push(...txs);

    // Both APIs return 25 txs per page
    if (txs.length < 25) break;

    lastTxid = txs[txs.length - 1].txid;
  }

  return allTxs;
}
