"use client";

import { AnimatePresence, motion } from "motion/react";
import type { PnLResult } from "@/lib/types";
import { HeroPnl } from "./hero-pnl";
import { BalanceCards } from "./balance-card";
import { TransactionTable } from "./transaction-table";
import { LoadingSkeleton } from "./loading-skeleton";

interface ResultsDashboardProps {
  data: PnLResult | null;
  loading: boolean;
  error: string | null;
}

export function ResultsDashboard({
  data,
  loading,
  error,
}: ResultsDashboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
          >
            <p className="text-destructive font-medium">{error}</p>
          </motion.div>
        )}

        {data && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <HeroPnl
              totalPnl={data.totalPnl}
              totalPnlPercent={data.totalPnlPercent}
            />
            <BalanceCards data={data} />
            <TransactionTable transactions={data.transactions} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
