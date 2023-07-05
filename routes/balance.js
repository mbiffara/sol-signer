const express = require('express');
const SolWallet = require('../services/solWalletService');

const router = express.Router();

/* GET balance */
router.get('/', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolWallet()).getBalance(req.query.address));
});

router.get('/usdc', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolWallet()).getUSDCBalance(req.query.address));
});

router.get('/sol', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolWallet()).getSolBalance(req.query.address));
});

module.exports = router;
