var express = require('express');
var router = express.Router();
const copperLaunchDashboardDAO = require('../models/copperLaunchDashboardDAO');
const copperLaunchProjectDAO = require('../models/copperLaunchProjectDAO');
const tokenDAO = require('../models/tokenDAO');

/* GET dashboard page. */
router.get('/', async function(req, res, next) {
  try {
    let message = null;
    let leaderboard = [];
    let token = null;
    let currentProject = null;
    const projects = await copperLaunchProjectDAO.loadAll();

    if (req.query.address !== undefined) {
      token = await tokenDAO.load(req.query.address);
      token.price = 0;
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.tokenAddress === req.query.address) {
          currentProject = project;
        }
      }
      if (currentProject !== null) {
        leaderboard = await copperLaunchDashboardDAO.load(currentProject.id);
      }
    }
    res.render('index', { 
      title: 'Leaderboard', 
      projects: projects, 
      currentProject: currentProject,
      leaderboard: leaderboard, 
      token: token, 
      message: message 
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/project', async function(req, res, next) {
  try {
    const projects = await copperLaunchProjectDAO.loadAll();
    res.render('project', {
      title: 'Project',
      projects: projects
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
