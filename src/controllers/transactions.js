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
      err: {
        code: transactions.status,
        message: transactions.data.error.message,
      },
      res: res,
    });
  }
};

export const getSolTransacions = async (req, res) => {
  const transactions = await getSolTransfers(req.query.address);

  if (transactions.status === 200) {
    endRequest({ response: transactions.data, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: transactions.status,
        message: transactions.data.error.message,
      },
      res: res,
    });
  }
};

export const getUsdcTransacions = async (req, res) => {
  const transactions = await getSplTransfers(req.query.address);

  if (transactions.status === 200) {
    endRequest({ response: transactions.data, code: 200, res });
  } else {
    catchRequest({
      err: {
        code: transactions.status,
        message: transactions.data.error.message,
      },
      res: res,
    });
  }
};
