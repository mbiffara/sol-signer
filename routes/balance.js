var express = require('express');
var solWallet = require('../services/solWalletService');

var router = express.Router();

/* GET balance */
router.get('/', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new solWallet()).getBalance(req.query.address));
});

router.get('/usdc', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new solWallet()).getUSDCBalance(req.query.address));
});

router.get('/sol', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new solWallet()).getSolBalance(req.query.address));
});

router.get('/create', async function(req, res, next) {
  res.send(await (new solWallet()).createWallet());
});

module.exports = router;
