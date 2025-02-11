const path = require('path');
const mysql = require('mysql2');
const multer  = require('multer');

module.exports = function generatePersistance(conf) {
    const connection = mysql.createConnection(conf);

    let storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, "files"));
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    const upload = multer({storage: storage}).single('file');

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

    executeQuery(`
        CREATE TABLE IF NOT EXISTS image
            (id INT PRIMARY KEY AUTO_INCREMENT, 
                url varchar(255) NOT NULL)
    `);

    return {
        insertImage: async (req, res) => {
            upload(req, res, err => {   
                const template = `
                INSERT INTO image (url) VALUES ('$URL')
                `;
            let sql = template.replace("$URL", "./images/"+req.file.filename);
            return executeQuery(sql);      
                       
            })
        },
        selectAllImages: async () => {
            const sql = `
                SELECT id, url FROM image
                `;
        return executeQuery(sql);
        },
        deleteImage: async (id) => {
            return executeQuery("DELETE FROM image WHERE id=" + id + ";");
        }
    };
};