const launchesModel = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function getLaunches(req, res) {
    const pagination = getPagination(req.query);
    return res.json(await launchesModel.getLaunches(null, null, { ...pagination }));
}

async function addLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({ error: 'Launch property missing.' });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Launch date invalid.' });
    }
    return res.status(201).json(await launchesModel.addLaunch(launch));
}

async function abortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const launch = await launchesModel.getLaunch(launchId);
    if (!launch) {
        return res.status(404).json({ error: 'Launch not found.' });
    }
    return res.json(await launchesModel.abortLaunch(launchId));
}

module.exports = { getLaunches, addLaunch, abortLaunch };
