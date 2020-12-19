const SHA265 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return new SHA265(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
  }

  // proof of work function to protect the block creation
  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  areTransactionsValid() {
    return this.transactions.every(tx => tx.isValid());
  }
}

module.exports.Block = Block;
