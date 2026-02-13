const BTC_ADDRESS_PATTERNS = [
  /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH / P2SH
  /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/,     // P2SH
  /^bc1[a-z0-9]{39,59}$/i,               // Bech32 / Bech32m
];

export function isValidBtcAddress(address: string): boolean {
  return BTC_ADDRESS_PATTERNS.some((pattern) => pattern.test(address));
}
