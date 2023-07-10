import { CURRENCIES } from "../constants/currencies.js";
import readableCoinBalance from "../mappers/readableCoinBalance.js";

export const all = (address, transactions, tokenType) => {
  return transactions.map((transaction) =>
    easyRead(transaction, tokenType, address)
  );
};

export const bySymbol = (address, transactions, tokenType, symbol) => {
  return transactions
    .filter((transaction) => transaction.symbol === symbol)
    .map((transaction) => easyRead(transaction));
};

export const easyRead = (transaction, tokenType, address) => {
  return tokenType === CURRENCIES.SOL
    ? easyReadSOL(transaction, address)
    : easyReadSPL(transaction, address);
};

export const easyReadSPL = (transaction, address) => {
  return {
    id: transaction.signature[0],
    symbol: transaction.symbol,
    address: transaction.address,
    from: transaction.changeType === "inc" ? transaction.address : address,
    to: transaction.changeType === "inc" ? address : transaction.address,
    type: transaction.changeType,
    amount: readableCoinBalance(CURRENCIES.USDC, transaction.changeAmount),
    date: new Date(transaction.blockTime * 1000),
    raw: transaction,
  };
};

export const easyReadSOL = (transaction, address) => {
  return {
    id: transaction.txHash,
    symbol: CURRENCIES.SOL,
    address: transaction.address,
    from: transaction.src,
    to: transaction.dst,
    type:
      transaction.dst.toLowerCase() === address.toLowerCase() ? "inc" : "out",
    amount: readableCoinBalance(CURRENCIES.SOL, transaction.lamport),
    date: new Date(transaction.blockTime * 1000),
    raw: transaction,
  };
};
