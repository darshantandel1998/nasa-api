const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const apisRouter = express.Router();

apisRouter.use('/planets', planetsRouter);
apisRouter.use('/launches', launchesRouter);

module.exports = apisRouter;
