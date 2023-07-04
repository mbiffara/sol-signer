const axios = require('axios');
const TransactionReaderService = require('./transactionReaderService');

class SolscanService {
  constructor() {
    this.apiToken = process.env.SOLSCAN_API_KEY;
  }

  async getTransactions(address) {
    const transactions = await this.makeRequest('/account/transactions', address);

    return transactions;
  }

  async getSolTransfers(address) {
    const transactions = await this.makeRequest('/account/solTransfers', address);
    const tService = new TransactionReaderService(address, transactions.data, 'SOL');

    return tService.all();
  }

  async getSplTransfers(address, symbol = null) {
    const transactions = await this.makeRequest('/account/splTransfers', address);
    const tService = new TransactionReaderService(address, transactions.data, 'SPL');

    if (symbol) {
      return tService.bySymbol(symbol);
    }

    return tService.all();
  }

  async makeRequest(method, account, limit = 50) {
    const url = `https://public-api.solscan.io${method}?account=${account}&limit=${limit}`;

    const response = await axios.get(url, { headers: { token: this.apiToken } });

    return response.data;
  }
}

module.exports = SolscanService;
