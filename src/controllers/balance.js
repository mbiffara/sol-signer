import {
  getBalance,
  getUSDCBalance,
  getSOLBalance,
} from "../services/solWalletService.js";

export const getAllBalance = async (req, res) => {
  res.send(await getBalance(req.query.address));
};

export const getUsdcBalance = async (req, res) => {
  res.send(await getUSDCBalance(req.query.address));
};

export const getSolBalance = async (req, res) => {
  res.send(await getSOLBalance(req.query.address));
};
