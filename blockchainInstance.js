// blockchainInstance.js
const Blockchain = require('./blockchain/Blockchain');
const blockchain = new Blockchain();

blockchain.init(); // inicializa con bloque génesis si es necesario

module.exports = blockchain;

