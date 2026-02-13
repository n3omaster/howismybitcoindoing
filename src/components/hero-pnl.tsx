"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { formatUsd, formatPercent } from "@/lib/format";

interface HeroPnlProps {
  totalPnl: number;
  totalPnlPercent: number;
}

function AnimatedNumber({
  value,
  formatter,
}: {
  value: number;
  formatter: (n: number) => string;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(value * eased);

      if (current >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{formatter(displayed)}</>;
}

export function HeroPnl({ totalPnl, totalPnlPercent }: HeroPnlProps) {
  const isProfit = totalPnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        className={`border-2 ${
          isProfit
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <CardContent className="flex flex-col items-center py-10">
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
            Total Profit & Loss
          </p>
          <p
            className={`text-5xl md:text-6xl font-bold tracking-tight ${
              isProfit ? "text-emerald-500" : "text-red-500"
            }`}
          >
            <AnimatedNumber value={totalPnl} formatter={formatUsd} />
          </p>
          <p
            className={`text-lg mt-2 font-medium ${
              isProfit ? "text-emerald-500/80" : "text-red-500/80"
            }`}
          >
            <AnimatedNumber
              value={totalPnlPercent}
              formatter={formatPercent}
            />
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
