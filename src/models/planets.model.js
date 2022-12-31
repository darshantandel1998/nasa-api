const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const Planet = require('./planets.mongo');

async function getPlanets(query = {}, select = null, option = {}) {
    return await Planet.find(query, select, option);
}

async function getPlanetsCount() {
    return await Planet.countDocuments({});
}

async function getPlanet(keplerName) {
    return await Planet.findOne({ keplerName });
}

async function savePlanet(planetData) {
    const planet = new Planet(planetData);
    await planet.save();
    return planet;
}

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

async function loadPlanets() {
    if (await getPlanetsCount()) {
        return;
    }
    const planetsStream = fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({ comment: '#', columns: true }));
    for await (let planet of planetsStream) {
        if (isHabitablePlanet(planet)) {
            await savePlanet({ keplerName: planet.kepler_name });
        }
    }
    console.log('Planets loaded.');
}

module.exports = { getPlanets, getPlanetsCount, getPlanet, savePlanet, loadPlanets };
