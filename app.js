const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

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
    if (!error)
        console.log("Server is Successfully Running, listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<p>Server is running OK</p>");
});