const SHA265 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return new SHA265(this.fromAddress + this.toAddress + this.amount).toString();
  }


  signTransaction(signingKey) {
    // check whether the signer is the wallet owner
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You are not allowed signing transactions for other wallets');
    }

    // generate signature for this transaction
    const hashTx = this.calculateHash();
    const sign = signingKey.sign(hashTx, 'base64');
    this.signature = sign.toDER('hex');
  }

  isValid() {
    // this is from the system
    if (this.fromAddress === null) return true;

    // check whether the signature exists
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in the transaction');
    }

    // reformat the from address (public key) to the hex format
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    // verify whether the signature is signed by this public key
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports.Transaction = Transaction;
