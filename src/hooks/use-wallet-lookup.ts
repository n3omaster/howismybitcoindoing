"use client";

import { useState, useCallback } from "react";
import type { PnLResult } from "@/lib/types";

interface WalletLookupState {
  data: PnLResult | null;
  loading: boolean;
  error: string | null;
}

export function useWalletLookup() {
  const [state, setState] = useState<WalletLookupState>({
    data: null,
    loading: false,
    error: null,
  });

  const lookup = useCallback(async (address: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ data: null, loading: false, error: json.error });
        return;
      }

      setState({ data: json, loading: false, error: null });
    } catch {
      setState({
        data: null,
        loading: false,
        error: "Failed to connect. Please try again.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, lookup, reset };
}
