const { query, format } = require('../config/mysqlConfig');

class CopperLaunchEvent {

    async loadAll() {
        try {
            var sql = 'SELECT * FROM `copperlaunchevent`';
            var selects = [];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async lastBlockNumber() {
        try {
            var sql = 'SELECT MAX(blockNumber) AS blockNumber FROM `copperlaunchevent`';
            var selects = [];
            sql = format(sql, selects);
            const res = await query(sql);
            return res[0].blockNumber !== null ? res[0].blockNumber : 12272146;
        } catch (error) {
            console.log(error);
        }
    }

    async insert(entity) {
        try {
            var sql = 'INSERT INTO `copperlaunchevent` (`address`, `blockHash`, `blockNumber`, `transactionHash`, `transactionIndex`, `event`, `returnValues`, `poolId`, `tokenIn`, `tokenOut`, `amountIn`, `amountOut`, `logId`, `from`, `to`) ' + 
            ' VALUES (?, ?, ?, ?, ?, ?)';
            var inserts = [entity.address, entity.blockHash, entity.blockNumber, entity.transactionHash, entity.transactionIndex, entity.event, entity.returnValues, entity.poolId, entity.tokenIn, entity.tokenOut, entity.amountIn, entity.amountOut, entity.logId, entity.form, entity.to];
            sql = format(sql, inserts);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async bulkInsert(entity) {
        try {
            var sql = 'INSERT INTO `copperlaunchevent` (`address`, `blockHash`, `blockNumber`, `transactionHash`, `transactionIndex`, `event`, `returnValues`, `poolId`, `tokenIn`, `tokenOut`, `amountIn`, `amountOut`, `logId`, `from`, `to`) VALUES ?';
            var airdrops = [];
            for (let i = 0; i < entity.length; i++) {
                const elem = entity[i];
                airdrops.push([elem.address, elem.blockHash, elem.blockNumber, elem.transactionHash, elem.transactionIndex, elem.event, elem.returnValues, elem.poolId, elem.tokenIn, elem.tokenOut, elem.amountIn, elem.amountOut, elem.logId, elem.from, elem.to]);
            }
            var inserts = [airdrops];
            sql = format(sql, inserts);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    // SELL
    async getSwapEventInByToken(token, blockNumber = undefined) {
        try {
            var sql = 'SELECT -CAST(amountIn AS DECIMAL(64, 0)) as amount, transactionhash, blocknumber, `from` FROM `copperlaunchevent` WHERE LOWER(tokenIn) = LOWER(?)';
            var selects = [token];
            if (blockNumber) {
                sql += ' AND blockNumber <= ?';
                selects.push(blockNumber);
            }
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    // BUY
    async getSwapEventOutByToken(token, blockNumber = undefined) {
        try {
            var sql = 'SELECT CAST(amountIn AS DECIMAL(64, 0)) as amount, transactionhash, blocknumber, `from` FROM `copperlaunchevent` WHERE LOWER(tokenOut) = LOWER(?)';
            var selects = [token];
            if (blockNumber) {
                sql += ' AND blockNumber <= ?';
                selects.push(blockNumber);
            }
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async getTotalSold(token, blockNumber = 99999999, decimals = 1) {
        try {
            var sql = 
                'SELECT SUM(amount) / 1e' + decimals + ' AS total FROM (' +
                    'SELECT SUM(amount) AS amount FROM (' +
                        'SELECT CAST(amountOut AS DECIMAL(64, 0)) as amount ' +
                        'FROM copperlaunchevent WHERE tokenout = ? and blockNumber <= ? ORDER BY `from`' +
                    ') x ' +
                    'UNION ALL ' +
                    'SELECT SUM(amount) AS amount FROM (' +
                        'SELECT -CAST(amountIn AS DECIMAL(64, 0)) as amount ' +
                        'FROM copperlaunchevent WHERE tokenin = ? and blockNumber <= ? ORDER BY `from`' +
                    ') y ' +
                ') total';
            var selects = [token, blockNumber, token, blockNumber];
            sql = format(sql, selects);
            const res = await query(sql);
            return (res.length > 0) ? res[0].total : null;
        } catch (error) {
            console.log(error);
        }
    }

    async getLeaderboardV2(token, price, total, blockNumber = 99999999, decimals = 1, limit = 200) {
        try {
            var sql = 
                'SELECT ROUND(SUM(amount) / 1e' + decimals + ', 2) AS amount, ' + 
                'ROUND(SUM(amount) * ' + price + ' / 1e' + decimals + ', 2) AS price, ' + 
                'ROUND(SUM(amount) / 1e' + decimals + ' / ' + total + ' * 100, 2) AS percentage, ' + 
                'address, SUM(buy) AS buy, SUM(sell) AS sell FROM (' +
                    'SELECT SUM(amount) AS amount, `from` AS address, COUNT(`from`) AS buy, 0 AS sell FROM (' +
                        'SELECT CAST(amountOut AS DECIMAL(64, 0)) as amount, transactionhash, blocknumber, `from`' + 
                        'FROM copperlaunchevent WHERE tokenout = ? and blockNumber <= ? ORDER BY `from`' +
                    ') x GROUP BY `from` ' +
                    'UNION ALL ' +    
                    'SELECT SUM(amount) AS amount, `from` AS address, 0 AS buy, COUNT(`from`) AS sell FROM (' +
                        'SELECT -CAST(amountIn AS DECIMAL(64, 0)) as amount, transactionhash, blocknumber, `from`' +
                        'FROM copperlaunchevent WHERE tokenin = ? and blockNumber <= ? ORDER BY `from`' +
                    ') y GROUP BY `from`' +
                ') z GROUP BY address ORDER BY amount DESC LIMIT ' + limit;
            var selects = [token, blockNumber, token, blockNumber];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async getLeaderboard(token, price, blockNumber = 99999999, decimals = 1, limit = 200) {
        try {
            var sql = 'SELECT ROUND(SUM(amount) / 1e' + decimals + ', 2) AS amount, ROUND(SUM(amount) * ' + price + ' / 1e' + decimals + ', 2) AS price, `from` AS address FROM (' +
                ' SELECT CAST(amountOut AS DECIMAL(64, 0)) AS amount, transactionhash, blocknumber, `from` FROM copperlaunchevent WHERE tokenout = ? and blockNumber <= ? ' +
                ' UNION ALL ' +
                ' SELECT -CAST(amountIn AS DECIMAL(64, 0)) AS amount, transactionhash, blocknumber, `from` FROM copperlaunchevent WHERE tokenin = ? and blockNumber <= ?' +    
                ' ) total GROUP BY `from` ORDER BY amount DESC LIMIT ' + limit;
            var selects = [token, blockNumber, token, blockNumber];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async getPrice(token, decimals = 1) {
        try {
            var sql = 'SELECT (CAST(amountIn AS DECIMAL(64, 0)) / 1e6) / (CAST(amountOut AS DECIMAL(64, 0)) / 1e' + decimals + ') AS price ' + 
            'FROM copperlaunchevent WHERE tokenOut = ? AND tokenIn = ? ORDER BY blockNumber DESC LIMIT 1';
            var selects = [token, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'];
            sql = format(sql, selects);
            const res = await query(sql);
            return (res.length > 0) ? res[0].price : 0;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new CopperLaunchEvent();
