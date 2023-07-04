var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    app: 'bahia-sol-signer',
    description: 'Solana signer for Bahia.Exchange',
    author: 'Bahia.Exchange',
    version: '0.0.1'
  });
});

module.exports = router;
