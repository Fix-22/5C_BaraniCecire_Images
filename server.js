const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const multer  = require('multer');

const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + "/ca.pem");
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject();     
            }
            resolve(result);     
        });
    })
};

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const app = express();
const upload = multer({storage: storage}).single('file');

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