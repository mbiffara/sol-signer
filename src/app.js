import express from "express";
import pino from "express-pino-logger";
import bodyParser from "body-parser";
// import cors from "cors";
import dotenv from "dotenv";
import initRoutes from "./routes.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

app.use(bodyParser.json({ limit: "50mb" }));

if (process.env.NODE_ENV !== "testing") {
  app.use(pino());
}

app.use(express.urlencoded({ extended: false }));

// Middelware, voor alle /api/* request
app.all("", function (req, res, next) {
  res.contentType("application/json");
  res.setHeader("x-sol-signer", "0.0.1");

  next();
});

initRoutes(app);

export default app;
