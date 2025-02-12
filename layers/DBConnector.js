const path = require('path');
const mysql = require('mysql2');

module.exports = function generateDBConnector(conf) {
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

    // crea tabella se non esiste
    executeQuery(`
        CREATE TABLE IF NOT EXISTS image
        (id INT PRIMARY KEY AUTO_INCREMENT, url varchar(255) NOT NULL);
    `);

    return {
        insertURL: async (filename) => {
            const template = "INSERT INTO image (url) VALUES ('$URL');";
            let sql = template.replace("$URL", "./images/" + filename);
            let r = await executeQuery(sql);   
            return r;
        },
        selectAllImages: async () => {
            return executeQuery("SELECT id, url FROM image;");
        },
        deleteImage: async (id) => {
            return executeQuery("DELETE FROM image WHERE id=" + id + ";");
        },
        clear: async () => {
            return executeQuery("TRUNCATE TABLE image;");
        }
    };
};