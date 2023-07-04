const express = require('express');
const SolscanService = require('../services/solscanService');

const router = express.Router();

/* GET balance */
router.get('/', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolscanService()).getTransactions(req.query.address));
});

router.get('/sol', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolscanService()).getSolTransfers(req.query.address));
});

router.get('/usdc', async function(req, res, next) {
  if (req.query.address === undefined) {
    res.status(400).send({ error: 'address is required' });
  }

  res.send(await (new SolscanService()).getSplTransfers(req.query.address, 'USDC'));
});

module.exports = router;
