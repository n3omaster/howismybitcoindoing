export function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center text-sm text-muted-foreground">
      <p>
        Prices from{" "}
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          CoinGecko
        </a>
        {" "}&middot;{" "}
        Blockchain data from{" "}
        <a
          href="https://blockstream.info"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Blockstream
        </a>
      </p>
      <p className="mt-1">
        Not financial advice. Use at your own risk.
      </p>
    </footer>
  );
}
