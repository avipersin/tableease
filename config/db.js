const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bfdecc39479008',
    password: 'bfdecc39479008',
    database: 'heroku_150cb394bbf6303'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;


