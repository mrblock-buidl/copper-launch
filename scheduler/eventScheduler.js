const BalancerVault = require('../libraries/BalancerVault');
const copperLaunchEventDAO = require('../models/copperLaunchEventDAO');
const Web3 = require('web3');
require('dotenv').config();

const INITIALIZE = process.env.INITIALIZE;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

const eventScheduler = async function() {
    while(true) {
        await fetchSwapEvent();
        if (INITIALIZE === 'false') break;
    }
    process.exit();
}

const fetchSwapEvent = async function() {
    const _lastBlockNumber = await copperLaunchEventDAO.lastBlockNumber();
    const events = await BalancerVault.eventSwap(_lastBlockNumber + 1);
    console.log('From Block:', _lastBlockNumber, ', Events:', events.length);
    const _events = [];
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const returnValues = event.returnValues;
        const _txHash = await web3.eth.getTransaction(event.transactionHash);
        _events.push({
            address: event.address,
            blockHash: event.blockHash,
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            transactionIndex: event.transactionIndex,
            returnValues: JSON.stringify(event.returnValues),
            poolId: returnValues.poolId,
            tokenIn: returnValues.tokenIn,
            tokenOut: returnValues.tokenOut,
            amountIn: returnValues.amountIn,
            amountOut: returnValues.amountOut,
            logId: event.id,
            event: event.event,
            from: _txHash.from,
            to: _txHash.to
        });
    }

    if (_events.length > 0) {
        await copperLaunchEventDAO.bulkInsert(_events);
    }
}

eventScheduler();
