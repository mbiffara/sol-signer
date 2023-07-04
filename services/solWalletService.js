const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58 = require('bs58');
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const { Connection, Keypair, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const readableCoinBalance = require('./readableCoinBalance');

class SolWalletService {
  constructor() {
    this.solWallet = {};
  }

  async getBalance(address) {
    const solBalance = await this.getSolBalance(address);
    const usdcBalance = await this.getUSDCBalance(address);

    return {
      address,
      sol: readableCoinBalance('SOL', solBalance?.lamports),
      usdc: readableCoinBalance('USDC', usdcBalance?.usdcBalance)
    };
  }

  async getSolBalance(address) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    const base58publicKey = new web3.PublicKey(address);
    const balance = await connection.getAccountInfo(base58publicKey);

    return balance;
  }

  async getUSDCBalance(address) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const usdcMint = new web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const base58publicKey = new web3.PublicKey(address);

    const ata = await splToken.getAssociatedTokenAddress(usdcMint, base58publicKey);

    const accountData = await splToken.getAccount(connection, ata, 'confirmed');

    return { usdcAddress: accountData.address, usdcBalance: accountData.amount.toString() };
  }

  async createWallet() {
    this.solWallet = Keypair.generate();
    console.log(this.solWallet);
    return this.solWallet;
  }

  async getTransactions(address) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const publicKey = new web3.PublicKey(address);

    const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 100 });
    return transactions;
  }

  async verifyFunds(address, amount, symbol) {
    if (symbol === 'SOL') {
      const solBalance = await this.getSolBalance(address);
      return solBalance?.lamports >= Number(amount) * Math.pow(10, 9);
    } else if (symbol === 'USDC') {
      const usdcBalance = await this.getUSDCBalance(address);
      return Number(usdcBalance?.usdcBalance) >= Number(amount) * Math.pow(10, 6);
    }
  }

  async transferFunds(fromAddress, toAddress, symbol, amount, secretKey) {
    const fundsAvailable = await this.verifyFunds(fromAddress, amount, symbol);
    const validKeyPair = await this.verifyKeyPair(fromAddress, secretKey);

    if (!fundsAvailable) return 'Insufficient funds';
    if (!validKeyPair) return 'Invalid fromAddress/SecretKey combination';

    if (symbol === 'SOL') {
      return this.transferSOL(fromAddress, toAddress, amount, secretKey);
    } else if (symbol === 'USDC') {
      return this.transferUSDC(fromAddress, toAddress, amount, secretKey);
    }
  }

  async transferSOL(fromAddress, toAddress, amount, secretKey) {
    const fromKeyPair = Keypair.fromSecretKey(this.getSecretKey(secretKey));
    const toPublicKey = new PublicKey(toAddress);

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: fromKeyPair.publicKey,
        toPubkey: toPublicKey,
        lamports: web3.LAMPORTS_PER_SOL * +(amount || 0)
      })
    );

    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeyPair],
      { commitment: 'confirmed' }
    );

    return signature;
  }

  async transferUSDC(fromAddress, toAddress, amount, secretKey) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const fromKeyPair = Keypair.fromSecretKey(this.getSecretKey(secretKey));

    const toPublicKey = new PublicKey(toAddress);

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeyPair,
      usdcMint,
      fromKeyPair.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeyPair,
      usdcMint,
      toPublicKey
    );

    const transaction = new web3.Transaction().add(
      splToken.createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromKeyPair.publicKey,
        Number(amount) * Math.pow(10, 6),
        [],
        undefined
      )
    );

    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeyPair],
      { commitment: 'confirmed' }
    );

    return signature;
  }

  verifyKeyPair(address, secretKey) {
    try {
      const publicKey = new PublicKey(address);
      const keypair = Keypair.fromSecretKey(this.getSecretKey(secretKey));

      return keypair.publicKey.toBase58() === publicKey.toBase58();
    } catch (e) {
      return false;
    }
  }

  getSecretKey(secretKey) {
    if (secretKey.isArray) {
      return Uint8Array.from(secretKey);
    }

    return bs58.decode(secretKey);
  }
}

module.exports = SolWalletService;
