const dotenv = require('dotenv').config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vgiouhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const dt = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};

exports.dt = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};