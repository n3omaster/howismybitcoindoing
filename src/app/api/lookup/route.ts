import { NextResponse } from "next/server";
import { isValidBtcAddress } from "@/lib/validate";
import { fetchAddressInfo, fetchAllTransactions } from "@/lib/blockstream";
import { fetchCurrentPrice } from "@/lib/coingecko";
import { resolvePrices } from "@/lib/price-cache";
import { classifyTransactions } from "@/lib/calculate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    if (!isValidBtcAddress(address.trim())) {
      return NextResponse.json(
        { error: "Invalid Bitcoin address" },
        { status: 400 }
      );
    }

    const trimmedAddress = address.trim();

    // Fetch address info and transactions in parallel
    const [addressInfo, transactions, currentPrice] = await Promise.all([
      fetchAddressInfo(trimmedAddress),
      fetchAllTransactions(trimmedAddress),
      fetchCurrentPrice(),
    ]);

    if (transactions.length === 0) {
      return NextResponse.json({
        address: trimmedAddress,
        balanceBtc: 0,
        balanceUsd: 0,
        currentPrice,
        costBasis: 0,
        totalPnl: 0,
        totalPnlPercent: 0,
        realizedPnl: 0,
        unrealizedPnl: 0,
        totalReceived: 0,
        totalSent: 0,
        txCount: 0,
        transactions: [],
      });
    }

    // Extract unique dates from confirmed transactions
    const uniqueDates = [
      ...new Set(
        transactions
          .filter((tx) => tx.status.confirmed && tx.status.block_time)
          .map((tx) =>
            new Date(tx.status.block_time! * 1000)
              .toISOString()
              .split("T")[0]
          )
      ),
    ];

    // Resolve historical prices (cache → CoinGecko fallback)
    const prices = await resolvePrices(uniqueDates);

    // Classify transactions and calculate P&L
    const result = classifyTransactions(
      trimmedAddress,
      transactions,
      prices,
      currentPrice
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Lookup error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
