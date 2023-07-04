
const axios = require('axios');
const TransactionReaderService = require('./transactionReaderService');

class SolscanService {
  constructor () {
    this.apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2ODgzMTIzNDk4NjUsImVtYWlsIjoibWFyY2Vsb0BwYWN0dGEuYXBwIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiaWF0IjoxNjg4MzEyMzQ5fQ.YEJYpw8hO7l8hCoODcfh9nhyLySDBqrSpYhMhqbljjY";
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

    const response = await axios.get(url, { headers: { 'token': this.apiToken } });

    return response.data
  }
}

module.exports = SolscanService;