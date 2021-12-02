var express = require('express');
var router = express.Router();
const errorCode = require('../constants/errorCode');
const copperLaunchEventDAO = require('../models/copperLaunchEventDAO');
const copperLaunchProjectDAO = require('../models/copperLaunchProjectDAO');
const tokenDAO = require('../models/tokenDAO');
const ERC20 = require('../libraries/ERC20');

router.get('/leaderboard/v2', async function(req, res, next) {
  try {
    let payload = {};
    if (req.query.address !== undefined) {
      const token = await tokenDAO.load(req.query.address);
      const price = await copperLaunchEventDAO.getPrice(req.query.address, token.decimals);
      const project = await copperLaunchProjectDAO.loadByTokenAddress(req.query.address);
      const blockNumber = (project && project.endBlockIndex) ? project.endBlockIndex : undefined;
      const limit = req.query.limit ?? 200;
      const total = await copperLaunchEventDAO.getTotalSold(req.query.address, blockNumber, token.decimals);
      const leaderboard = await copperLaunchEventDAO.getLeaderboardV2(req.query.address, price, total, blockNumber, token.decimals, limit);
      payload = {
        leaderboard: leaderboard
      };
    } else {
      payload = {
        error: errorCode.MISSING_PARAMETER.code,
        message: errorCode.MISSING_PARAMETER.message
      };
      res.status(errorCode.MISSING_PARAMETER.code).json(payload);
      return;
    }
    res.json(payload);
  } catch (error) {
    console.log(error);
    res.status(errorCode.INTERNAL_SERVER_ERROR.code).json({ 
      error: errorCode.INTERNAL_SERVER_ERROR.code, 
      message: errorCode.INTERNAL_SERVER_ERROR.message
    });
  }
});

router.get('/project', async function(req, res, next) {
  try {
    let payload = {};
    const project = await copperLaunchProjectDAO.loadAll();
    payload = {
      project: project
    };
    res.json(payload);
  } catch (error) {
    console.log(error);
    res.status(errorCode.INTERNAL_SERVER_ERROR.code).json({ 
      error: errorCode.INTERNAL_SERVER_ERROR.code, 
      message: errorCode.INTERNAL_SERVER_ERROR.message
    });
  }
});

router.post('/project', async function(req, res, next) {
  try {
    let payload = {};

    if (req.body.name === undefined || 
      req.body.tokenAddress === undefined || 
      req.body.lpTokenAddress === undefined) {
      payload = {
        error: errorCode.MISSING_PARAMETER.code,
        message: errorCode.MISSING_PARAMETER.message
      };
      res.status(errorCode.MISSING_PARAMETER.code).json(payload);
      return;
    }

    const _name = await ERC20.name(req.body.tokenAddress);
    const _symbol = await ERC20.symbol(req.body.tokenAddress);
    const _decimals = await ERC20.decimals(req.body.tokenAddress);

    await copperLaunchProjectDAO.insert({
      name: req.body.name,
      tokenAddress: req.body.tokenAddress,
      lpTokenAddress: req.body.lpTokenAddress,
      endBlockIndex: (req.body.endBlockIndex) ? req.body.endBlockIndex : null 
    });

    await tokenDAO.insert({
      name: _name,
      symbol: _symbol,
      address: req.body.tokenAddress,
      decimals: _decimals
    });
    payload = {
      isSuccess: true
    };
    res.json(payload);
  } catch (error) {
    console.log(error);
    res.status(errorCode.INTERNAL_SERVER_ERROR.code).json({ 
      error: errorCode.INTERNAL_SERVER_ERROR.code, 
      message: errorCode.INTERNAL_SERVER_ERROR.message
    });
  }
});

router.delete('/project', async function(req, res, next) {
  try {
    let payload = {};
    if (req.query.id === undefined) {
      payload = {
        error: errorCode.MISSING_PARAMETER.code,
        message: errorCode.MISSING_PARAMETER.message
      };
      res.status(errorCode.MISSING_PARAMETER.code).json(payload);
      return;
    }

    await copperLaunchProjectDAO.delete(req.query.id);

    payload = {
      isSuccess: true
    }
    res.json(payload);
  } catch (error) {
    console.log(error);
    res.status(errorCode.INTERNAL_SERVER_ERROR.code).json({ 
      error: errorCode.INTERNAL_SERVER_ERROR.code, 
      message: errorCode.INTERNAL_SERVER_ERROR.message
    });
  }
});

module.exports = router;
