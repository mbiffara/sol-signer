import { CURRENCIES } from "../constants/currencies.js";

export default function readableCoinBalance(coin, balance) {
  switch (coin) {
    case CURRENCIES.SOL:
      return balance / 1000000000;
    case CURRENCIES.USDC:
      return balance / 1000000;
    default:
      return balance;
  }
}
