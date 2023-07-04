<!-- Add a h1 title -->
# Bahia Sol Signer
<!-- adds description of project -->
Express API Service to interact with Sol blockchain, it doesn't store any private key, it just signs transactions and send them to the blockchain.
You can also check balance and transactions history.

## Installation
`yarn`

## Usage

**Check Balance**

`curl --location --request GET 'http://localhost:3000/balance?address={publicKey}'`

**Check Transactions History**

`curl --location --request GET 'http://localhost:3000/transactions?address={publicKey}'`

**Send Transaction**

```curl --location --request POST 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
    "address": "{publicKey}",
    "destination": "{publicKey}",
    "amount": 0.1,
    "symbol": "SOL",
    "private_key": "{privateKey}"
}'

