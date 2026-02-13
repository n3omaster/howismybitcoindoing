import type { BlockstreamTx, ClassifiedTx, PnLResult } from "./types";
import { satsToBtc } from "./format";

export function classifyTransactions(
  address: string,
  txs: BlockstreamTx[],
  prices: Record<string, number>,
  currentPrice: number
): PnLResult {
  const classified: ClassifiedTx[] = [];

  for (const tx of txs) {
    const timestamp = tx.status.block_time ?? Math.floor(Date.now() / 1000);
    const date = new Date(timestamp * 1000).toISOString().split("T")[0];

    // Sum outputs going TO this address
    const received = tx.vout
      .filter((o) => o.scriptpubkey_address === address)
      .reduce((sum, o) => sum + o.value, 0);

    // Sum inputs coming FROM this address
    const sent = tx.vin
      .filter((i) => i.prevout?.scriptpubkey_address === address)
      .reduce((sum, i) => sum + (i.prevout?.value ?? 0), 0);

    const netSats = received - sent;
    if (netSats === 0) continue;

    const amountBtc = Math.abs(satsToBtc(netSats));
    const priceAtTime = prices[date] ?? currentPrice;
    const valueAtTime = amountBtc * priceAtTime;

    classified.push({
      txid: tx.txid,
      date,
      timestamp,
      type: netSats > 0 ? "IN" : "OUT",
      amountBtc,
      priceAtTime,
      valueAtTime,
      confirmed: tx.status.confirmed,
    });
  }

  // Sort by timestamp descending (newest first)
  classified.sort((a, b) => b.timestamp - a.timestamp);

  // Calculate P&L
  const inTxs = classified.filter((t) => t.type === "IN");
  const outTxs = classified.filter((t) => t.type === "OUT");

  const costBasis = inTxs.reduce((sum, t) => sum + t.valueAtTime, 0);
  const totalReceivedBtc = inTxs.reduce((sum, t) => sum + t.amountBtc, 0);
  const totalSentBtc = outTxs.reduce((sum, t) => sum + t.amountBtc, 0);
  const valueOfOutTxs = outTxs.reduce((sum, t) => sum + t.valueAtTime, 0);

  const balanceBtc = totalReceivedBtc - totalSentBtc;
  const balanceUsd = balanceBtc * currentPrice;

  // Average cost basis per BTC
  const avgCostPerBtc =
    totalReceivedBtc > 0 ? costBasis / totalReceivedBtc : 0;

  // Realized P&L: sold at market price - cost basis of sold coins
  const costBasisOfSold = totalSentBtc * avgCostPerBtc;
  const realizedPnl = valueOfOutTxs - costBasisOfSold;

  // Unrealized P&L: current value of holdings - cost basis of remaining coins
  const costBasisOfHeld = balanceBtc * avgCostPerBtc;
  const unrealizedPnl = balanceUsd - costBasisOfHeld;

  const totalPnl = realizedPnl + unrealizedPnl;
  const totalPnlPercent = costBasis > 0 ? (totalPnl / costBasis) * 100 : 0;

  return {
    address,
    balanceBtc,
    balanceUsd,
    currentPrice,
    costBasis,
    totalPnl,
    totalPnlPercent,
    realizedPnl,
    unrealizedPnl,
    totalReceived: totalReceivedBtc,
    totalSent: totalSentBtc,
    txCount: classified.length,
    transactions: classified,
  };
}
