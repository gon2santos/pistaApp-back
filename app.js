const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var carouselData = require('./data');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const dotenv = require('dotenv').config();
/* import { carruselesData } from './data'; */

const app = express();
const PORT = 3000;
const convertHour = (unixtime) => {
    var newDate = new Date();
    newDate.setTime(unixtime * 1000);
    return (newDate.getHours())
}

app.use(express.json());
app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
app.use(body_parser.json({ limit: "50mb" }));
app.use(morgan('dev'));
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*"
        //"GET, POST, OPTIONS, PUT, DELETE,PATCH"
    );
    next();
});
app.use((0, cors)());

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, listening on port " + PORT)
    }
    else
        console.log("Error occurred, server can't start", error);
}
);

app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(200).json({ response: "OK!" }); /* send("<p>Server is running OK</p>"); */
});

app.get('/carruseles', (req, res) => {
    res.set('Content-Type', 'application/json');
    var resData = [];
    carouselData.default.forEach(function (obj, i) {
        resData.push({ airportCode: obj.airportCode, flightCode: obj.flightCode, carousel: obj.carousel, id: i });
    });
    res.status(200).json(resData); /* send("<p>Server is running OK</p>"); */
});

app.get('/flights', (req, res) => {
    console.log("Request AEP flights data");
    fetch(`https://airlabs.co/api/v9/schedules?dep_iata=AEP&api_key=${process.env.AIRLABS_KEY}`)
        .then(r => {
            return r.json()
        })
        .then(r => res.json(r))//debug
        /* .then(r => r.response.sort((p1, p2) =>
                (p1.dep_time_ts > p2.dep_time_ts) ? 1 :
                    (p1.dep_time_ts < p2.dep_time_ts) ? -1 : 0))
        .then(r => r.map(e => e = { ...e, timeHr: convertHour(e.dep_time_ts) }))
        .then(r => res.json(r)) */
        .catch(e => res.status(500).send(`Error fetching flights: ${e.message}`))
}) 