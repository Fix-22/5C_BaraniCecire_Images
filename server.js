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

//funzione per memorizzazione delle immagini su file system
let storage = multer.diskStorage({ 
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "images"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({storage: storage}).single('file');

db.createTable();

app.use("/", express.static(path.join(__dirname, "public"))); //permette download della pagina lato client
app.use("/images", express.static(path.join(__dirname, "images"))); //permette accesso alle immagini
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))); //permette accesso a bootstrap all'appliacazione lato client

//espone il web service per aggiungere immagini
app.post('/add', multer({storage: storage}).single('file'), async (req, res) => {
    db.insertURL(req.file.filename); //manda url al database
    res.json({result: "Ok"});
    console.log("Uploaded: " + req.file.filename);
});

//web services che permette di avere tutte le url delle immagini
app.get('/get', async (req, res) => {
    const images = await db.selectAllImages();
    res.json({images: images});
});

//web services per cancellare le immagini dal db dato il suo id
app.delete('/delete/:id', async (req, res) => {
    await db.deleteImage(req.params.id);
    res.json({result: "Ok"});

    console.log("Deleted image with id: " + req.params.id)
});

const server = http.createServer(app);

//parte il server
server.listen(5600, () => { 
    console.log("Server running...");
});