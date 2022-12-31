const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

async function connect() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI);
}

async function disconnect() {
    await mongoose.disconnect();
}

mongoose.connection.once('open', () => {
    console.log('Mongodb connection ready.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

module.exports = { connect, disconnect };
