const {Transaction} = require("./transaction");
const {Block} = require("./block");

class Blockchain {
  constructor() {
    this.chain = [this.getGenesisBlock()];
    this.difficulty = 2;
    /*
      ensure each block is created every ten minutes
      the pending transaction array is to temporarily store the transaction between
     */
    this.pendingTransations = [];

    this.miningReward = 100;
  }

  // the first block in the blockchain called genesis block
  getGenesisBlock() {
    return new Block('21/07/1994', [], 'GenesisBlock');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(receiveRewardAddress) {
    // send a mining reward to the miner from the system
    const rewardTx = new Transaction(null, receiveRewardAddress, this.miningReward)
    this.pendingTransations.push(rewardTx);

    // create a block for the pending transactions
    const block = new Block(Date.now(), this.pendingTransations, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    // reset the pending transactions array
    this.pendingTransations = [];
  }

  /**
   * @description To add a transaction to the chain
   * @param transaction {Transaction}
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    if (!transaction.isValid()) {
      throw new Error('Invalid transaction cannot be added to the chain');
    }

    this.pendingTransations.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.toAddress === address) balance += transaction.amount;
        if (transaction.fromAddress === address) balance -= transaction.amount;
      });
    });

    return balance;
  }

  isChainValid() {
    return this.chain.every((block, index) => {
      // skip genesis block
      if (index > 0) {
        const previousBlock = this.chain[index - 1];

        if (!block.areTransactionsValid()) return false;
        if (block.hash !== block.calculateHash()) return false;
        if (previousBlock.hash !== block.previousHash) return false;
      }

      return true;
    });
  }
}

module.exports.Blockchain = Blockchain;
