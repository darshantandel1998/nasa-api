const planetsModel = require('../../models/planets.model');
const { getPagination } = require('../../services/query');

async function getPlanets(req, res) {
    const pagination = getPagination(req.query);
    return res.json(await planetsModel.getPlanets(null, null, { ...pagination }));
}

module.exports = { getPlanets };
