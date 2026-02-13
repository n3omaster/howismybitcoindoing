import { createClient } from "@supabase/supabase-js";
import { fetchHistoricalPrice } from "./coingecko";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function resolvePrices(
  dates: string[]
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  const supabase = getSupabase();

  if (dates.length === 0) return prices;

  // 1. Batch query cached prices from Supabase
  if (supabase) {
    const { data } = await supabase
      .from("btc_prices")
      .select("date, price_usd")
      .in("date", dates);

    if (data) {
      for (const row of data) {
        prices[row.date] = Number(row.price_usd);
      }
    }
  }

  // 2. Identify missing dates
  const missing = dates.filter((d) => !(d in prices));

  // 3. Fetch missing prices from CoinGecko with rate limiting
  const newPrices: { date: string; price_usd: number }[] = [];

  for (const date of missing) {
    try {
      const price = await fetchHistoricalPrice(date);
      prices[date] = price;
      newPrices.push({ date, price_usd: price });
    } catch (err) {
      console.error(`Failed to fetch price for ${date}:`, err);
      prices[date] = 0;
    }

    // Rate limit: ~1 call per 2.1 seconds for free tier
    if (missing.indexOf(date) < missing.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    }
  }

  // 4. Cache new prices in Supabase
  if (supabase && newPrices.length > 0) {
    await supabase
      .from("btc_prices")
      .upsert(newPrices, { onConflict: "date" });
  }

  return prices;
}
