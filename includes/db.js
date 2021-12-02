const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_saboroso',
    password: 'root'
});

module.exports = connection