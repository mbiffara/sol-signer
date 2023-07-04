const readableCoinBalance = require("./readableCoinBalance");

class TransactionReaderService {
  constructor(address, transactions, tokenType) {
    this.transactions = transactions;
    this.tokenType = tokenType;
    this.address = address;
  }

  all() {
    return this.transactions.map(transaction => this.easyRead(transaction));
  }

  bySymbol(symbol) {
    return this.transactions.filter(transaction => transaction.symbol === symbol).map(transaction => this.easyRead(transaction));
  }

  easyRead(transaction){
    return this.tokenType == "SOL" ? this.easyReadSOL(transaction) : this.easyReadSPL(transaction);
  }

  easyReadSPL(transaction){
    return {
      id: transaction.signature.first,
      symbol: transaction.symbol,
      address: transaction.address,
      from: transaction.changeType == "inc" ? transaction.address : this.address, 
      to: transaction.changeType == "inc" ? this.address : transaction.address,
      type: transaction.changeType,
      amount: readableCoinBalance("USDC", transaction.changeAmount),
      date: new Date(transaction.blockTime * 1000),
      raw: transaction
    }
  }

  easyReadSOL(transaction){
    return {
      id: transaction.txHash,
      symbol: "SOL",
      address: transaction.address,
      from: transaction.src,
      to: transaction.dst,
      type: transaction.dst.toLowerCase() == this.address.toLowerCase() ? "inc" : "out",
      amount: readableCoinBalance("SOL", transaction.lamport),
      date: new Date(transaction.blockTime * 1000),
      raw: transaction
    }
  }
}

module.exports = TransactionReaderService;