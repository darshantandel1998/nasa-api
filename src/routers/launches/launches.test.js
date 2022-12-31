const request = require('supertest');

const app = require('../../app');
const database = require('../../services/database');

describe('Test /v1/launches', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('Test POST /v1/launches', () => {
        const launchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'January 4, 2028'
        };

        test('It should respond with 201 created', async () => {
            const response = await request(app).post('/v1/launches').send(launchData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toMatchObject(JSON.parse(JSON.stringify({
                ...launchData,
                launchDate: new Date(launchData.launchDate)
            })));
        });

        test('It should catch missing required launch property', async () => {
            const response = await request(app).post('/v1/launches').send({ ...launchData, launchDate: undefined })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({ error: 'Launch property missing.' });
        });

        test('It should catch invalid launch date', async () => {
            const response = await request(app).post('/v1/launches').send({ ...launchData, launchDate: 'launchDate' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({ error: 'Launch date invalid.' });
        });
    });

    describe('Test DELETE /v1/launches/id', () => { });
});
