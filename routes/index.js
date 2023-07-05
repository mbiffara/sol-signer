const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    app: 'sol-signer',
    description: 'Solana signer API',
    author: 'Bahia.Exchange',
    version: '0.0.1'
  });
});

module.exports = router;
