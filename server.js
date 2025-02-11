const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const generatePersistance = require("./layers/persistance.js");

const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + "/ca.pem");

const persistance = generatePersistance(conf);

const app = express();

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.post('/add', (req, res) => {
    
});

app.get('/get', (req, res) => {

});

app.delete('/delete/:id', (req, res) => {

});

const server = http.createServer(app);

server.listen(80, () => {
    console.log("Server running...");
});