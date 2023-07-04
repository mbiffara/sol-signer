var express = require('express');
var solWallet = require('../services/solWalletService');

var router = express.Router();

/* POST send */
router.post('/', async function(req, res, next) {
  if (req.body.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }
  if (req.body.private_key === undefined) {
    res.status(400).send({ error: 'private_key is required' });
  }
  if (req.body.destination === undefined) {
    res.status(400).send({ error: 'destination is required' });
  }
  if (req.body.amount === undefined) {
    res.status(400).send({ error: 'amount is required' });
  }
  if (req.body.token === undefined) {
    res.status(400).send({ error: 'token is required' });
  }

  const fromAddress = req.body.address;
  const secretKey = req.body.private_key;
  const toAddress = req.body.destination;
  const amount = req.body.amount;
  const symbol = req.body.token;

  (fromAddress, toAddress, symbol, amount, secretKey)

  res.send(await (new solWallet()).transferFunds(fromAddress, toAddress, symbol, amount, secretKey));
  
  // res.send({ msg: true});
  // res.send(await (new SolscanService()).getTransactions(req.query.address));
});


module.exports = router;
