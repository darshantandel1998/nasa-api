const axios = require('axios');

const Launch = require('./launches.mongo');
const planetModel = require('./planets.model');

const DEFAULT_FLIGHT_NUMBER = 1;
const SPACEX_API_URL = 'https://api.spacexdata.com/v5';

async function getLaunches(query = {}, select = null, option = {}) {
    return await Launch.find(query, select, option);
}

async function getLaunchesCount() {
    return await Launch.countDocuments({});
}

async function getLaunch(flightNumber) {
    return await Launch.findOne({ flightNumber });
}

async function saveLaunch(launchData) {
    const launch = new Launch(launchData);
    await launch.save();
    return launch;
}

async function getNextFlightNumber() {
    const launch = await Launch.findOne({}).sort('-flightNumber');
    return (launch?.flightNumber || DEFAULT_FLIGHT_NUMBER) + 1;
}

async function addLaunch(launchData) {
    const planet = await planetModel.getPlanet(launchData.target);
    if (!planet) {
        throw new Error('Launch target is not found.');
    }
    return await saveLaunch({
        ...launchData,
        flightNumber: await getNextFlightNumber(),
        customers: ['ZTM', 'NASA'],
        upcoming: true
    });
}

async function abortLaunch(flightNumber) {
    const launch = await getLaunch(flightNumber);
    launch.success = false;
    launch.upcoming = false;
    await launch.save();
    return launch;
}

async function loadLaunches() {
    if (await getLaunchesCount()) {
        return;
    }
    const response = await axios.post(`${SPACEX_API_URL}/launches/query`, {
        query: {},
        options: {
            select: ['flight_number', 'name', 'date_local', 'upcoming', 'success'],
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ],
            pagination: false
        }
    });

    if (response.status !== 200) {
        throw new Error('Launch data not found.');
    }

    const launches = response.data.docs;
    for (const launch of launches) {
        await saveLaunch({
            flightNumber: launch.flight_number,
            launchDate: launch.date_local,
            mission: launch.name,
            rocket: launch.rocket.name,
            customers: launch.payloads.flatMap(payload => payload.customers),
            upcoming: launch.upcoming,
            success: launch.success ?? false,
        });
    }
    console.log('Launches loaded.');
}

module.exports = { getLaunches, getLaunchesCount, getLaunch, saveLaunch, addLaunch, abortLaunch, loadLaunches };
