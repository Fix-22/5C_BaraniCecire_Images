const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const generatedb = require("./layers/DBConnector");

const conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.db.ssl.ca = fs.readFileSync(path.join(__dirname, "ca.pem"));

const db = generatedb(conf.db);

const app = express();

let storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, "images"));
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    const upload = multer({storage: storage}).single('file');

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.post('/add', async (req, res) => {
    upload(req, res, (err) => {
        db.insertURL(req.file.filename);
        res.json({result: "Ok"});

        console.log("Uploaded: " + req.file.filename)
    });
});

app.get('/get', async (req, res) => {
    const images = await db.selectAllImages();
    res.json({images: images});
});

app.delete('/delete/:id', async (req, res) => {
    await db.deleteImage(req.params.id);
    res.json({result: "Ok"});

    console.log("Deleted image with id: " + req.params.id)
});

const server = http.createServer(app);

server.listen(80, () => {
    console.log("Server running...");
});