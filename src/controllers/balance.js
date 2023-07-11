import {
  getBalance,
  getUSDCBalance,
  getSOLBalance,
} from "../services/solWalletService.js";

import { endRequest, catchRequest } from "../helpers/request.js";

export const getAllBalance = async (req, res) => {
  const balance = await getBalance(req.query.address);

  if (balance) {
    endRequest({ response: balance, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: res.statusCode,
        message: "error",
      },
      res: res,
    });
  }
};

export const getUsdcBalance = async (req, res) => {
  const balance = await getUSDCBalance(req.query.address).catch(
    (error) => error
  );

  if (Object.keys(balance).length > 0) {
    endRequest({ response: balance, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: 400,
        message: "Error",
      },
      res: res,
    });
  }
};

export const getSolBalance = async (req, res) => {
  const balance = await getSOLBalance(req.query.address).catch(
    (error) => error
  );

  if (balance) {
    endRequest({ response: balance, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: res.statusCode,
        message: "error",
      },
      res: res,
    });
  }
};
