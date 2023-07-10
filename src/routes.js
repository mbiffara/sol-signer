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
import balance from "./schemas/balance.js";
import { validateSchemaAndFail } from "./middlewares/params.js";

export default (app) => {
  app.get("/health", health);

  app.get("/balance", [validateSchemaAndFail(balance)], getAllBalance);
  app.get("/balance/usdc", [validateSchemaAndFail(balance)], getUsdcBalance);
  app.get("/balance/sol", [validateSchemaAndFail(balance)], getSolBalance);

  app.get("/transactions", [validateSchemaAndFail(balance)], getTransacions);
  app.get(
    "/transactions/usdc",
    [validateSchemaAndFail(balance)],
    getUsdcTransacions
  );
  app.get(
    "/transactions/sol",
    [validateSchemaAndFail(balance)],
    getSolTransacions
  );

  app.post("/send", send);
};
