import { validateSchemaAndFail } from "./middlewares/params.js";
import health from "./controllers/health_check.js";

import {
  getSolTransacions,
  getTransacions,
  getUsdcTransacions,
} from "./controllers/transactions.js";

import {
  getAllBalance,
  getSolBalance,
  getUsdcBalance,
} from "./controllers/balance.js";

import { send } from "./controllers/send.js";

import balanceSchema from "./schemas/balance.js";
import transactionsSchema from "./schemas/transactions.js";
import sendSchema from "./schemas/send.js";

export default (app) => {
  app.get("/health", health);

  app.get("/balance", [validateSchemaAndFail(balanceSchema)], getAllBalance);
  app.get(
    "/balance/usdc",
    [validateSchemaAndFail(balanceSchema)],
    getUsdcBalance
  );
  app.get(
    "/balance/sol",
    [validateSchemaAndFail(balanceSchema)],
    getSolBalance
  );

  app.get(
    "/transactions",
    [validateSchemaAndFail(transactionsSchema)],
    getTransacions
  );
  app.get(
    "/transactions/usdc",
    [validateSchemaAndFail(transactionsSchema)],
    getUsdcTransacions
  );
  app.get(
    "/transactions/sol",
    [validateSchemaAndFail(transactionsSchema)],
    getSolTransacions
  );

  app.post("/send", [validateSchemaAndFail(sendSchema)], send);
};
