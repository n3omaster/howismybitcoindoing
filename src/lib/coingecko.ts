const BASE_URL = "https://api.coingecko.com/api/v3";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/json" };
  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }
  return headers;
}

async function cgFetch(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers: getHeaders() });

    if (res.status === 429 && attempt < retries) {
      // Wait longer on each retry: 5s, 10s, 15s
      await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
      continue;
    }

    return res;
  }
  throw new Error("Unreachable");
}

export async function fetchHistoricalPrice(date: string): Promise<number> {
  // date format: "yyyy-mm-dd" → CoinGecko wants "dd-mm-yyyy"
  const [y, m, d] = date.split("-");
  const cgDate = `${d}-${m}-${y}`;

  const res = await cgFetch(
    `${BASE_URL}/coins/bitcoin/history?date=${cgDate}&localization=false`
  );

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("CoinGecko rate limit exceeded");
    }
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  const data = await res.json();
  return data.market_data?.current_price?.usd ?? 0;
}

export async function fetchCurrentPrice(): Promise<number> {
  const res = await cgFetch(
    `${BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd`
  );

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  const data = await res.json();
  return data.bitcoin?.usd ?? 0;
}
