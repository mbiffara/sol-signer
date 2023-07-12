import web3 from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, clusterApiUrl, PublicKey } from "@solana/web3.js";
import readableCoinBalance from "../mappers/readableCoinBalance.js";
import { CURRENCIES } from "../constants/currencies.js";
import logger from "../logger.js";

export const getBalance = async (address) => {
  const solBalance = await getSOLBalance(address);
  const usdcBalance = await getUSDCBalance(address);

  return {
    address,
    sol: readableCoinBalance(CURRENCIES.SOL, solBalance?.lamports),
    usdc: readableCoinBalance(CURRENCIES.USDC, usdcBalance?.usdcBalance),
  };
};

export const getSOLBalance = async (address) => {
  const connection = new Connection(
    clusterApiUrl(process.env.SOL_CLUSTER),
    "confirmed"
  );

  const base58publicKey = new web3.PublicKey(address);
  return await connection.getAccountInfo(base58publicKey);
};

export const getUSDCBalance = async (address) => {
  const connection = new Connection(
    clusterApiUrl(process.env.SOL_CLUSTER),
    "confirmed"
  );

  const usdcMint = new PublicKey(process.env.USDC_MINT_ADDRESS);

  const base58publicKey = new PublicKey(address);

  const ata = await getAssociatedTokenAddress(usdcMint, base58publicKey);

  const accountData = await getAccount(connection, ata, "confirmed").catch(
    (response) => response
  );

  return {
    usdcAddress: accountData.address,
    usdcBalance: accountData.amount.toString(),
  };
};

export const createWallet = async () => {
  const solWallet = Keypair.generate();

  return {
    publicKey: solWallet.publicKey,
    secretKey: bs58.encode(solWallet.secretKey),
  };
};

export const getTransactions = async (address) => {
  const connection = new Connection(
    clusterApiUrl(process.env.SOL_CLUSTER),
    "confirmed"
  );
  const publicKey = new web3.PublicKey(address);

  const transactions = await connection.getConfirmedSignaturesForAddress2(
    publicKey,
    { limit: 100 }
  );
  return transactions;
};

export const transferFunds = async (
  fromAddress,
  toAddress,
  symbol,
  amount,
  secretKey
) => {
  const fundsAvailable = await verifyFunds(fromAddress, amount, symbol);
  const validKeyPair = await verifyKeyPair(fromAddress, secretKey);

  if (!fundsAvailable) return "Insufficient funds";
  if (!validKeyPair) return "Invalid fromAddress/SecretKey combination";

  if (symbol === CURRENCIES.SOL) {
    return transferSOL(fromAddress, toAddress, amount, secretKey);
  } else if (symbol === CURRENCIES.USDC) {
    return transferUSDC(fromAddress, toAddress, amount, secretKey);
  }
};

export const transferSOL = async (
  fromAddress,
  toAddress,
  amount,
  secretKey
) => {
  const fromKeyPair = Keypair.fromSecretKey(getSecretKey(secretKey));
  const toPublicKey = new PublicKey(toAddress);

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromKeyPair.publicKey,
      toPubkey: toPublicKey,
      lamports: web3.LAMPORTS_PER_SOL * +(amount || 0),
    })
  );

  const connection = new Connection(
    clusterApiUrl(process.env.SOL_CLUSTER),
    "confirmed"
  );

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromKeyPair],
    { commitment: "confirmed" }
  );

  return signature;
};

export const transferUSDC = async (
  fromAddress,
  toAddress,
  amount,
  secretKey
) => {
  const connection = new Connection(
    clusterApiUrl(process.env.SOL_CLUSTER),
    "confirmed"
  );
  const usdcMint = new PublicKey(process.env.USDC_MINT_ADDRESS);

  const fromKeyPair = Keypair.fromSecretKey(getSecretKey(secretKey));

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
    createTransferInstruction(
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
    { commitment: "confirmed" }
  );

  return signature;
};

export const verifyFunds = async (address, amount, symbol) => {
  if (symbol === CURRENCIES.SOL) {
    const solBalance = await getSOLBalance(address);
    return solBalance?.lamports >= Number(amount) * Math.pow(10, 9);
  } else if (symbol === CURRENCIES.USDC) {
    const usdcBalance = await getUSDCBalance(address);
    return Number(usdcBalance?.usdcBalance) >= Number(amount) * Math.pow(10, 6);
  }
};

export const verifyKeyPair = async (address, secretKey) => {
  try {
    const publicKey = new PublicKey(address);
    const keypair = Keypair.fromSecretKey(getSecretKey(secretKey));

    return keypair.publicKey.toBase58() === publicKey.toBase58();
  } catch (e) {
    return false;
  }
};

export const getSecretKey = (secretKey) => {
  if (secretKey.isArray) {
    return Uint8Array.from(secretKey);
  }

  return bs58.decode(secretKey);
};
