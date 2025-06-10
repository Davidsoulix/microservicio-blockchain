// Blockchain.js
const crypto = require('crypto');
const db = require('../db');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
        ).digest('hex');
    }
}

class Blockchain {
    constructor() { }

    async init() {
        const blocks = await db('blocks').orderBy('index', 'asc');
        if (blocks.length === 0) {
            await this.saveBlock(new Block(0, Date.now(), { message: 'Genesis Block' }, '0'));
        }
    }

    async getLatestBlock() {
        const last = await db('blocks').orderBy('index', 'desc').first();
        return last;
    }

    async addBlock(data, qrImageBase64 = null) {
        const prev = await this.getLatestBlock();
        const index = prev ? prev.index + 1 : 1;
        const timestamp = Date.now();
        const previousHash = prev ? prev.hash : '0';
        const tempBlock = new Block(index, timestamp, data, previousHash);

        await this.saveBlock(tempBlock, qrImageBase64);
        return tempBlock;
    }

    async saveBlock(block, qrImageBase64 = null) {
        await db('blocks').insert({
            index: block.index,
            timestamp: new Date(block.timestamp),
            data: JSON.stringify(block.data),
            previous_hash: block.previousHash,
            hash: block.hash,
            qrImageBase64: qrImageBase64 // nombre correcto de la columna
        });
    }


    async getLoteHistory(lote) {
        const allBlocks = await db('blocks')
            .whereRaw(`data->>'lote' = ?`, [lote])
            .orderBy('index', 'asc');
        return allBlocks;
    }
}

module.exports = Blockchain;
