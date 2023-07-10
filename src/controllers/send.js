import { transferFunds } from "../services/solWalletService.js";

export const send = async (req, res) => {
  if (req.body.address === undefined) {
    res.status(400).send({ error: "address is required" });
  }
  if (req.body.private_key === undefined) {
    res.status(400).send({ error: "private_key is required" });
  }
  if (req.body.destination === undefined) {
    res.status(400).send({ error: "destination is required" });
  }
  if (req.body.amount === undefined) {
    res.status(400).send({ error: "amount is required" });
  }
  if (req.body.symbol === undefined) {
    res.status(400).send({ error: "token is required" });
  }

  const fromAddress = req.body.address;
  const secretKey = req.body.private_key;
  const toAddress = req.body.destination;
  const amount = req.body.amount;
  const symbol = req.body.symbol;

  res.send(transferFunds(fromAddress, toAddress, symbol, amount, secretKey));
};
