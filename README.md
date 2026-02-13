# &#8383; How Is My Bitcoin Doing?

> Enter a Bitcoin address. See if you're winning or losing. That's it.

A single-purpose Bitcoin wallet P&L tracker. Paste a BTC address, and the app fetches every transaction, resolves historical prices at the time of each tx, and tells you whether you're in profit or loss.

**[howismybitcoindoing.com](https://howismybitcoindoing.com)**

---

## Features

- **Instant P&L** — total profit/loss with animated counter
- **Cost basis tracking** — average cost basis method across all transactions
- **Realized & unrealized split** — see what you've locked in vs. what's still floating
- **Full transaction history** — paginated, sortable, with IN/OUT classification
- **Historical price resolution** — fetches BTC price at the exact date of each transaction
- **Price caching** — Supabase cache layer so CoinGecko isn't hammered on repeat lookups
- **Multi-provider fallback** — mempool.space + Blockstream Esplora for reliability
- **Dark mode** — because Bitcoin doesn't sleep
- **Animated UI** — smooth transitions, staggered row reveals, number counters
- **Dynamic OG image** — auto-generated social preview card
- **Mobile responsive** — works on any screen size

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Animations | [Motion](https://motion.dev) (Framer Motion) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) |
| Blockchain | [mempool.space](https://mempool.space/docs/api) / [Blockstream Esplora](https://github.com/Blockstream/esplora) |
| Prices | [CoinGecko API](https://www.coingecko.com/en/api) |
| Cache | [Supabase](https://supabase.com) (PostgreSQL) |
| Deploy | [Vercel](https://vercel.com) |

## How It Works

```
User enters BTC address
  → POST /api/lookup
    → mempool.space: fetch address info + all transactions (paginated)
    → Extract unique dates from transactions
    → Supabase: batch query cached prices
    → CoinGecko: fetch missing prices (rate-limited with retry)
    → Cache new prices in Supabase
    → Classify transactions as IN/OUT relative to address
    → Calculate P&L (average cost basis method)
  → Client renders results with animations
```

### P&L Calculation

For each transaction, the net flow relative to the queried address is computed:

```
net = received_outputs - spent_inputs
  → positive = IN (you received BTC)
  → negative = OUT (you sent BTC)
```

```
Total P&L = Current Holdings Value + Value of OUT txs - Cost Basis of IN txs

Where:
  Current Holdings Value = balance_btc x current_price
  Value of OUT txs       = SUM(out_btc x price_at_send_time)
  Cost Basis of IN txs   = SUM(in_btc x price_at_receive_time)
```

Realized vs unrealized split uses the **average cost basis** method.

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/howismybitcoindoing.git
cd howismybitcoindoing
npm install
```

### 2. Environment variables

Copy `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
COINGECKO_API_KEY=CG-xxx
```

| Variable | Required | How to get |
|----------|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional* | [supabase.com](https://supabase.com) → project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional* | Same page, `service_role` key |
| `COINGECKO_API_KEY` | Optional* | [coingecko.com/en/api](https://www.coingecko.com/en/api) → Demo plan (free) |

*\*The app works without these — Supabase caching and higher CoinGecko rate limits are disabled.*

### 3. Supabase setup (optional)

If using Supabase for price caching, run this in your project's **SQL Editor**:

```sql
CREATE TABLE btc_prices (
  date       DATE PRIMARY KEY,
  price_usd  NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE btc_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON btc_prices FOR SELECT USING (true);
CREATE POLICY "Allow server insert" ON btc_prices FOR INSERT WITH CHECK (true);
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout, fonts, metadata, SEO
│   ├── page.tsx                  # Main page (client component)
│   ├── globals.css               # Tailwind + dark theme
│   ├── opengraph-image.tsx       # Dynamic OG image generation
│   └── api/lookup/route.ts       # Main API route
├── components/
│   ├── ui/                       # shadcn: button, card, input, table, skeleton, badge
│   ├── address-form.tsx          # Wallet address input + validation
│   ├── results-dashboard.tsx     # Loading/error/results state orchestrator
│   ├── hero-pnl.tsx              # Big P&L number with animated counter
│   ├── balance-card.tsx          # Balance, cost basis, current price cards
│   ├── transaction-table.tsx     # Paginated transaction list
│   ├── loading-skeleton.tsx      # Skeleton UI while fetching
│   └── footer.tsx                # Footer with attributions
├── hooks/
│   └── use-wallet-lookup.ts      # Client-side fetch state management
└── lib/
    ├── types.ts                  # TypeScript interfaces
    ├── validate.ts               # BTC address regex validation
    ├── format.ts                 # Number/date formatters
    ├── blockstream.ts            # Blockchain API (mempool.space + Blockstream fallback)
    ├── coingecko.ts              # CoinGecko price API with retry
    ├── price-cache.ts            # Supabase cache → CoinGecko fallback
    └── calculate.ts              # Transaction classification + P&L math
```

## API

### `POST /api/lookup`

**Request:**

```json
{
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
}
```

**Response:**

```json
{
  "address": "bc1q...",
  "balanceBtc": 0.5,
  "balanceUsd": 48500.00,
  "currentPrice": 97000.00,
  "costBasis": 25000.00,
  "totalPnl": 23500.00,
  "totalPnlPercent": 94.00,
  "realizedPnl": 0,
  "unrealizedPnl": 23500.00,
  "totalReceived": 0.5,
  "totalSent": 0,
  "txCount": 3,
  "transactions": [
    {
      "txid": "abc123...",
      "date": "2024-01-15",
      "timestamp": 1705312000,
      "type": "IN",
      "amountBtc": 0.25,
      "priceAtTime": 43000.00,
      "valueAtTime": 10750.00,
      "confirmed": true
    }
  ]
}
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/howismybitcoindoing)

Or manually:

```bash
npm run build
npm start
```

## License

MIT