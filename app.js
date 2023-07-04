var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var balanceRouter = require('./routes/balance');
var transactionsRouter = require('./routes/transactions');
var sendRouter = require('./routes/send');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middelware, voor alle /api/* request
app.all('', function(req, res, next) 
{
  // Set response contenttype
  res.contentType('application/json');
  res.setHeader('x-bahia-sol-signer', '0.0.1');

  next();
});

app.use('/', indexRouter);
app.use('/balance', balanceRouter);
app.use('/transactions', transactionsRouter);
app.use('/send', sendRouter);

module.exports = app;
