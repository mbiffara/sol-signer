function readableCoinBalance(coin, balance) {
  switch (coin) {
    case 'SOL':
      return balance / 1000000000;
    case 'USDC':
      return balance / 1000000;
    default:
      return balance;
  }
}

module.exports = readableCoinBalance;
