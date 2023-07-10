const express = require('express');
const SolWallet = require('../services/solWalletService');

const router = express.Router();

router.post('/', async function(req, res, next) {
  res.send(await (new SolWallet()).createWallet());
});

router.get('/verify', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  if (req.query.secret_key === undefined) {
    res.status(400).send({ error: 'secret_key is required' });
  }

  res.send(new SolWallet().verifyKeyPair(req.query.address, req.query.secret_key));
});

module.exports = router;
