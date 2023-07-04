const web3 = require("@solana/web3.js");
const splToken = require('@solana/spl-token');
const bs58 = require('bs58');
const { getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token');
const { Connection, Keypair, clusterApiUrl, getAccount, PublicKey } = require("@solana/web3.js");
const readableCoinBalance = require("./readableCoinBalance");

class SolWalletService {
    constructor() {
        this.solWallet = {};
    }

    async getBalance(address) {
      const solBalance = await this.getSolBalance(address);
      const usdcBalance = await this.getUSDCBalance(address);

      return {
        address: address,
        sol: readableCoinBalance("SOL", solBalance?.lamports), 
        usdc: readableCoinBalance("USDC", usdcBalance?.usdcBalance) 
      };
    }

    async getSolBalance(address){
      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      
      let base58publicKey = new web3.PublicKey(address);

      let balance = await connection.getAccountInfo(base58publicKey);
      console.log(balance);
      return balance;
    }

    async getUSDCBalance(address) {
      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      const usdcMint = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

      let base58publicKey = new web3.PublicKey(address);

      const ata = await splToken.getAssociatedTokenAddress(usdcMint, base58publicKey);

      let accountData = await splToken.getAccount(connection, ata, "confirmed");

      console.log(accountData.address);
      return { usdcAddress: accountData.address, usdcBalance: accountData.amount.toString() };
    }

    async createWallet() {
      this.solWallet = Keypair.generate();
      console.log(this.solWallet);
      return this.solWallet;
    }

    async getTransactions(address) {
      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      const publicKey = new web3.PublicKey(address);

      const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, {limit: 100});
      return transactions;
    }

    async verifyFunds(address, amount, symbol) {
      if (symbol === "SOL") {
        const solBalance = await this.getSolBalance(address);
        return solBalance?.lamports >= Number(amount)*Math.pow(10, 9);
      } else if (symbol === "USDC") {
        const usdcBalance = await this.getUSDCBalance(address);
        return Number(usdcBalance?.usdcBalance) >= Number(amount)*Math.pow(10, 6);
      }
    }

    async transferFunds(fromAddress, toAddress, symbol, amount, secretKey) {
      const fundsAvailable = await this.verifyFunds(fromAddress, amount, symbol);
      const validKeyPair = await this.verifyKeyPair(fromAddress, secretKey);

      if (!fundsAvailable) return "Insufficient funds";
      if (!validKeyPair) return "Invalid fromAddress/SecretKey combination";

      if (symbol === "SOL") {
        return this.transferSOL(fromAddress, toAddress, amount, secretKey);
      }
      else if (symbol === "USDC") {
        return this.transferUSDC(fromAddress, toAddress, amount, secretKey);
      }
    }

    async transferSOL(fromAddress, toAddress, amount, secretKey) {
      return new solWeb3.Transaction().add(
        solWeb3.SystemProgram.transfer({
          fromPubkey: fromKeyPair.publicKey,
          toPubkey: new solWeb3.PublicKey(toPubKey),
          lamports: solWeb3.LAMPORTS_PER_SOL * +(amount || 0),
        })
      )
    }

    async transferUSDC(fromAddress, toAddress, amount, secretKey) {
      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

      const fromKeyPair = Keypair.fromSecretKey(this.getSecretKey(secretKey));

      const toPublicKey = new PublicKey(toAddress);

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        usdcMint,
        fromKeyPair.publicKey
      )

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        usdcMint,
        toPublicKey
      );

      const transaction = new web3.Transaction().add(
        splToken.createTransferInstruction(
          fromTokenAccount.address, // source address
          toTokenAccount.address, // dest address
          fromKeyPair.publicKey,
          // Number(amount)*Math.pow(10, tokenInfo.decimals),
          Number(amount)*Math.pow(10, 6),
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

      console.log(signature);
      return signature;
    }

    verifyKeyPair(address, secretKey) {
      try {
        const publicKey = new PublicKey(address);
        const keypair = Keypair.fromSecretKey(this.getSecretKey(secretKey));

        return keypair.publicKey.toBase58() === publicKey.toBase58();
      }
      catch (e) {
        return false;
      }
    }

    getSecretKey(secretKey){
      if (secretKey.isArray) {
        return Uint8Array.from(secretKey);
      }

      return bs58.decode(secretKey);
    }
}

module.exports = SolWalletService;