const { query, format } = require('../config/mysqlConfig');

class CopperLaunchProject {

    async loadAll() {
        try {
            var sql = 'SELECT * FROM `copperlaunchproject`';
            var selects = [];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async load(id) {
        try {
            var sql = 'SELECT * FROM `copperlaunchproject` WHERE id = ? LIMIT 1';
            var selects = [id];
            sql = format(sql, selects);
            const res = await query(sql);
            return res[0];
        } catch (error) {
            console.log(error);
        }
    }

    async loadByTokenAddress(tokenAddress) {
        try {
            var sql = 'SELECT * FROM `copperlaunchproject` WHERE tokenAddress = ? LIMIT 1';
            var selects = [tokenAddress];
            sql = format(sql, selects);
            const res = await query(sql);
            return res[0];
        } catch (error) {
            console.log(error);
        }
    }
    
    async loadByLPAddress(lpTokenAddress) {
        try {
            var sql = 'SELECT * FROM `copperlaunchproject` WHERE lpTokenAddress = ?';
            var selects = [lpTokenAddress];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async insert(entity) {
        try {
            var sql = 'INSERT INTO `copperlaunchproject` (`name`, `tokenAddress`, `lpTokenAddress`, `endBlockIndex`, `createTimestamp`) ' + 
            'VALUES (?, ?, ?, ?, NOW())';
            var inserts = [entity.name, entity.tokenAddress, entity.lpTokenAddress, entity.endBlockIndex];
            sql = format(sql, inserts);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id) {
        try {
            var sql = 'DELETE FROM `copperlaunchproject` WHERE `id` = ?';
            var deletes = [id];
            sql = format(sql, deletes);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new CopperLaunchProject();
