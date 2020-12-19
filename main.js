const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Transaction} = require("./transaction");
const {Blockchain} = require("./blockchain");
const secret = require('./secret.json');

const myKey = ec.keyFromPrivate(secret.JimmyKey.private);
const myWalletAddress = myKey.getPublic('hex');

const blackCoin = new Blockchain();

// transfer 10 coins to Liza
const tx1 = new Transaction(myWalletAddress, secret.LizaKey.walletAddress, 10);
tx1.signTransaction(myKey);
blackCoin.addTransaction(tx1);

console.log('Starting the miner...');
blackCoin.minePendingTransactions(myWalletAddress);

console.log('My balance is', blackCoin.getBalanceOfAddress(myWalletAddress));
console.log('Is chain valid?', blackCoin.isChainValid());
//
// console.log('I am going to modify the amount of the previous transaction from 10 to 1');
// blackCoin.chain[1].transactions[0].amount = 1;
// console.log('Now, my balance is ', blackCoin.getBalanceOfAddress(myWalletAddress), 'Is chain valid?', blackCoin.isChainValid());
//
// // transfer 2 more coins to Liza
// const tx2 = new Transaction(myWalletAddress, secret.LizaKey.walletAddress, 2);
// tx2.signTransaction(myKey);
// blackCoin.addTransaction(tx2);
//
// console.log('Starting the miner again...');
// blackCoin.minePendingTransactions(myWalletAddress);

// console.log('My balance is ', blackCoin.getBalanceOfAddress(myWalletAddress), 'Is chain valid?', blackCoin.isChainValid());

