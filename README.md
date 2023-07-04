<!-- Add a h1 title -->
# Bahia Sol Signer
<!-- adds description of project -->
Express API Service to interact with Sol blockchain, it doesn't store any private key, it just signs transactions and send them to the blockchain.
You can also check balance and transactions history.

## Installation
`yarn`

## Usage

**Check Balance**
Returns balance in SOL and USDC

`curl --location --request GET 'http://localhost:3000/balance?address={publicKey}'`

**Check Transactions History**
Gets native transactions history

`curl --location --request GET 'http://localhost:3000/transactions?address={publicKey}'`

**Check USDC Transactions History**
Gets USDC transactions history
`curl --location --request GET 'http://localhost:3000/transactions/usdc?address={publicKey}'`

**Check SOL Transactions History**
Gets SOL transactions history
`curl --location --request GET 'http://localhost:3000/transactions/sol?address={publicKey}'`

**Send Transaction**
It supports SOL and USDC transactions

```curl --location --request POST 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
    "address": "{publicKey}",
    "destination": "{publicKey}",
    "amount": 0.1,
    "symbol": "SOL",
    "private_key": "{privateKey}"
}'
---
<!-- Adds open source license -->
## License
MIT License

Copyright (c) [2023] [Bahia.Exchange]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
<!-- Adds line  -->
---
© 2023 Bahia.Exchange
[Bahia.Exchange]: https://bahia.exchange

