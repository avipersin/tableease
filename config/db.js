const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bfdecc39479008',
    password: 'd9d922b1',
    database: 'heroku_150cb394bbf6303'
});


module.exports = connection;


