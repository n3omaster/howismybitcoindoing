"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd, formatDate } from "@/lib/format";
import type { ClassifiedTx } from "@/lib/types";

interface TransactionTableProps {
  transactions: ClassifiedTx[];
}

const PAGE_SIZE = 10;

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  if (transactions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Transactions ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount (BTC)</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="hidden sm:table-cell">TxID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tx, i) => (
                  <motion.tr
                    key={tx.txid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.type === "IN" ? "default" : "secondary"}
                        className={
                          tx.type === "IN"
                            ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-red-500/15 text-red-600 hover:bg-red-500/20"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {tx.amountBtc.toFixed(8)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatUsd(tx.priceAtTime)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatUsd(tx.valueAtTime)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <a
                        href={`https://blockstream.info/tx/${tx.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground font-mono"
                      >
                        {tx.txid.slice(0, 8)}...
                      </a>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
