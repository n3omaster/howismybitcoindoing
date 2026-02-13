export interface AddressInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

export interface TxVout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number;
}

export interface TxVin {
  txid: string;
  vout: number;
  prevout: TxVout | null;
  scriptsig: string;
  scriptsig_asm: string;
  witness?: string[];
  is_coinbase: boolean;
  sequence: number;
}

export interface BlockstreamTx {
  txid: string;
  version: number;
  locktime: number;
  vin: TxVin[];
  vout: TxVout[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface ClassifiedTx {
  txid: string;
  date: string;
  timestamp: number;
  type: "IN" | "OUT";
  amountBtc: number;
  priceAtTime: number;
  valueAtTime: number;
  confirmed: boolean;
}

export interface PnLResult {
  address: string;
  balanceBtc: number;
  balanceUsd: number;
  currentPrice: number;
  costBasis: number;
  totalPnl: number;
  totalPnlPercent: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalReceived: number;
  totalSent: number;
  txCount: number;
  transactions: ClassifiedTx[];
}
