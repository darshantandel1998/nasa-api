const http = require('http');

const app = require('./app');

const database = require('./services/database');

const { loadPlanets } = require('./models/planets.model');
const { loadLaunches } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

(async () => {
    await database.connect();
    await loadPlanets();
    await loadLaunches();

    server.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}.`);
    });
})();
