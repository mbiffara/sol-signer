import { CURRENCIES } from "../constants/currencies.js";
import {
  getTransactions,
  getSolTransfers,
  getSplTransfers,
} from "../services/solscanService.js";

import { endRequest, catchRequest } from "../helpers/request.js";

export const getTransacions = async (req, res) => {
  const transactions = await getTransactions(req.query.address);

  if (transactions.status === 200) {
    endRequest({ response: transactions.data, code: 200, res });
  } else {
    catchRequest({
      err: { code: transactions.status, message: transactions.statusText },
      res,
    });
  }
};

export const getSolTransacions = async (req, res) => {
  const transactions = await getSolTransfers(req.query.address);
  if (transactions.status === 200) {
    endRequest({ response: transactions.data, code: 200, res });
  } else {
    catchRequest({
      err: { code: res.data.status, message: res.data.error.message },
      res,
    });
  }
};

export const getUsdcTransacions = async (req, res) => {
  const transactions = await getSplTransfers(req.query.address);

  if (transactions.status === 200) {
    endRequest({ response: transactions.data, code: 200, res });
  } else {
    catchRequest({
      err: { code: res.data.status, message: res.data.error.message },
      res,
    });
  }
};
