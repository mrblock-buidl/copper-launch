const { query, format } = require('../config/mysqlConfig');

class CopperLaunchDashboard {

    async loadAll() {
        try {
            var sql = 'SELECT * FROM `copperlaunchdashboard`';
            var selects = [];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async load(projectId) {
        try {
            var sql = 'SELECT * FROM `copperlaunchdashboard` WHERE `copperLaunchProjectId` = ?';
            var selects = [projectId];
            sql = format(sql, selects);
            const res = await query(sql);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new CopperLaunchDashboard();
