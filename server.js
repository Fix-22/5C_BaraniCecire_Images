const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const generatePersistance = require("./layers/persistance.js");

const conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.persistance.ssl.ca = fs.readFileSync(path.join(__dirname, "ca.pem"));

const persistance = generatePersistance(conf.persistance);

const app = express();

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.post('/add', async (req, res) => {
    console.log(req)
    const r = await persistance.insertImage(req, res);
    console.log(r);
    res.json({result: "Ok"});
});

app.get('/get', async (req, res) => {
    const images = await persistance.selectAllImages();
    res.json({images: images});
});

app.delete('/delete/:id', async (req, res) => {
    const r = await persistance.deleteImage(req.params.id);
    console.log(r);
    res.json({result: "Ok"});
});

const server = http.createServer(app);

server.listen(80, () => {
    console.log("Server running...");
});