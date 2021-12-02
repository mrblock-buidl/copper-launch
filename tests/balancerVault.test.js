const BalancerVault = require('../libraries/BalancerVault');

const WETH = async function() {
    console.log(await BalancerVault.WETH());
}

WETH();
