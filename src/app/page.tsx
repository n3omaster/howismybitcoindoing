"use client";

import { AddressForm } from "@/components/address-form";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Footer } from "@/components/footer";
import { useWalletLookup } from "@/hooks/use-wallet-lookup";

export default function Home() {
  const { data, loading, error, lookup } = useWalletLookup();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            How Is My Bitcoin Doing?
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Enter a BTC address to see if your wallet is in profit or loss.
          </p>
        </div>

        <AddressForm onSubmit={lookup} loading={loading} />
        <ResultsDashboard data={data} loading={loading} error={error} />
      </main>
      <Footer />
    </div>
  );
}
