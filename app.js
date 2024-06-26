const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var carouselData = require('./data');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const dotenv = require('dotenv').config();
const flights = require('./db/models/flights');
const carruseles = require('./db/models/carruseles');
const inscriptos = require('./db/models/inscriptos');
const mongoose = require('mongoose');
const config = require('./db/db_config');

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
//=======START SERVER=======//
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, listening on port " + PORT)
    }
    else
        console.log("Error occurred, server can't start", error);
});

//=======CONNECT TO DB=======//
mongoose.set('strictQuery', true);

mongoose
    .connect(config.dt.mongo.url, {
        retryWrites: true,
        w: "majority",
    })
    .then(() => {
        console.log("Started the database");
    })
    .catch((err) => {
        console.log(err);
    });

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
        .then(r => r.response.sort((p1, p2) =>
            (p1.dep_time_ts > p2.dep_time_ts) ? 1 :
                (p1.dep_time_ts < p2.dep_time_ts) ? -1 : 0))
        .then(r => r.map(e => e = { ...e, timeHr: convertHour(e.dep_time_ts) }))
        .then(r => res.json(r))
        .catch(e => res.status(500).send(`Error fetching flights: ${e.message}`))
})

//Database access routes
//Add a new flights
app.post("/flights/create", async (req, res) => {
    let { destino, codigo, carrusel } = req.body;
    try {
        if (typeof destino === "string")
            destino = destino.toLocaleUpperCase();
        const flight = new flights.default({
            destino: destino,
            codigo: codigo,
            carrusel: carrusel
        });
        const savedFlight = await flight.save();
        res.status(200).send(savedFlight);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
//get all flights
app.get("/flights/all", async (req, res) => {
    try {
        await flights.default.find({})
            .then((allFlights) => {
                res.status(200).send(allFlights)
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
//Add a new carousel
app.post("/carousel/create", async (req, res) => {
    let { direccion, numero } = req.body;
    try {
        if (typeof direccion === "string")
            direccion = direccion.toLocaleUpperCase();
        const carrusel = new carruseles.default({
            direccion: direccion,
            numero: numero
        });
        const savedCarru = await carrusel.save();
        res.status(200).send(savedCarru);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
//get all carousels
app.get("/carousel/all", async (req, res) => {
    try {
        await carruseles.default.find({})
            .then((allCarrus) => {
                res.status(200).send(allCarrus)
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//Add a new inscripto
app.post("/inscriptos/create", async (req, res) => {
    let { nombre, dni, trabajo, puesto, tel, email, alim } = req.body;
    try {
        const inscr = new inscriptos.default({
            nombre: nombre,
            dni: dni,
            trabajo: trabajo,
            puesto: puesto,
            tel: tel,
            email: email,
            alim: alim
        });
        const savedInscr = await inscr.save();
        res.status(200).send(savedInscr);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//get all inscriptos
app.get("/inscriptos/all", async (req, res) => {
    try {
        await inscriptos.default.find({})
            .then((allInscr) => {
                res.status(200).send(allInscr)
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


//delete inscripto por dni
app.delete("/inscriptos/delete", async (req, res) => {
    let { dni } = req.body;
    try {
        const deletedInscr = await inscriptos.default.findOneAndDelete({ dni: dni });
        if (!deletedInscr) {
            return res.status(404).send({ message: "not found" });
        }
        res.status(200).send("unsubscribed");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});