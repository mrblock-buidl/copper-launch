const { query, format } = require('../config/mysqlConfig');

class Token {

    async loadAll() {
        try {
            var sql = 'SELECT * FROM `token`';
            var selects = [];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async load(tokenAddress) {
        try {
            var sql = 'SELECT * FROM `token` WHERE `address` = ?';
            var selects = [tokenAddress];
            sql = format(sql, selects);
            const res = await query(sql);
            return res[0];
        } catch (error) {
            console.log(error);
        }
    }

    async insert(entity) {
        try {
            var sql = 'INSERT INTO `token` (`name`, `symbol`, `address`, `decimals`) VALUES (?, ?, ?, ?)';
            var inserts = [entity.name, entity.symbol, entity.address, entity.decimals];
            sql = format(sql, inserts);
            const res = await query(sql);
            return res[0];
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Token();
