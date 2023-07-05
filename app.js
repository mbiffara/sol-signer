require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const accountsRouter = require('./routes/accounts');
const balanceRouter = require('./routes/balance');
const transactionsRouter = require('./routes/transactions');
const sendRouter = require('./routes/send');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middelware, voor alle /api/* request
app.all('', function(req, res, next) {
  res.contentType('application/json');
  res.setHeader('x-sol-signer', '0.0.1');

  next();
});

app.use('/', indexRouter);
app.use('/accounts', accountsRouter);
app.use('/balance', balanceRouter);
app.use('/transactions', transactionsRouter);
app.use('/send', sendRouter);

module.exports = app;
