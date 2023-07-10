/* eslint-disable global-require */

import logger from "./src/logger.js";
import app from "./src/app.js";

try {
  app.listen(process.env.PORT || 8080);
  logger.info(`Listening on port ${process.env.PORT}`);
} catch (error) {
  logger.error(error);
}