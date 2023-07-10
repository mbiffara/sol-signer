import axios from "axios";
import { all, bySymbol } from "./transactionReaderService.js";
import { CURRENCIES } from "../constants/currencies.js";
import { response } from "express";

export const getTransactions = async (address) => {
  const transactions = await makeRequest("/account/transactions", address);

  return transactions;
};

export const getSolTransfers = async (address) => {
  const transactions = await makeRequest("/account/solTransfers", address);

  return all(address, transactions.data, CURRENCIES.SOL);
};

export const getSplTransfers = async (address, symbol = null) => {
  const transactions = await makeRequest("/account/splTransfers", address);

  if (symbol) {
    return bySymbol(address, transactions.data, "SPL", symbol);
  }

  return all(address, transactions.data, "SPL");
};

const makeRequest = async (method, account, limit = 50) => {
  const url = `https://public-api.solscan.io${method}?account=${account}&limit=${limit}`;

  const response = await axios.get(url, {
    headers: { token: process.env.SOLSCAN_API_KEY },
  });

  return response;
};
