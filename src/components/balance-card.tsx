"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBtc, formatUsd } from "@/lib/format";
import type { PnLResult } from "@/lib/types";

interface BalanceCardProps {
  data: PnLResult;
}

export function BalanceCards({ data }: BalanceCardProps) {
  const cards = [
    {
      title: "Current Balance",
      primary: `${formatBtc(data.balanceBtc * 1e8)} BTC`,
      secondary: formatUsd(data.balanceUsd),
    },
    {
      title: "Cost Basis",
      primary: formatUsd(data.costBasis),
      secondary: `Avg ${formatUsd(data.balanceBtc > 0 ? data.costBasis / (data.totalReceived || 1) : 0)}/BTC`,
    },
    {
      title: "Current BTC Price",
      primary: formatUsd(data.currentPrice),
      secondary: `${data.txCount} transactions`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.primary}</p>
              <p className="text-sm text-muted-foreground">{card.secondary}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
