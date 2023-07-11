import { transferFunds } from "../services/solWalletService.js";
import { endRequest, catchRequest } from "../helpers/request.js";

export const send = async (req, res) => {
  const fromAddress = req.body.address;
  const secretKey = req.body.private_key;
  const toAddress = req.body.destination;
  const amount = req.body.amount;
  const symbol = req.body.symbol;

  const send = await transferFunds(
    fromAddress,
    toAddress,
    symbol,
    amount,
    secretKey
  );

  if (send.length === 88) {
    endRequest({ response: send, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: 400,
        message: `Error: ${send}`,
      },
      res: res,
    });
  }
};
