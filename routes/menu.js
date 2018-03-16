const express = require('express');
const router = express.Router();
const db = require('./db');


/* GET home page. */
router.get('/', function (req, res, next) {
    getAllergies(function (rows) {
        res.render('menu', {allergies: rows});
    });
});

router.post('/restaurant/post', function (req, res, next) {
    var formFields = req.body;
    addRestaurant(formFields, function () {
        res.render('action', {data: 'Added' + JSON.stringify(formFields)});
    });

});

router.get('/restaurant/:id', function (req, res, next) {
    var id = req.params.id;
    getRestaurant(id, function (rows) {
        res.render('action', {data: JSON.stringify(rows[0])});
    });
});

module.exports = router;

// mysql functions related to register
function getAllergies(callback) {
    var query = "select * from allergies";
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}


function addRestaurant(formFields, callback) {
    var name = formFields.name;
    var address = formFields.address;
    var email = formFields.email;
    var phoneNumber = formFields.phoneNumber;
    var password = formFields.password;
    var confirmPassword = formFields.confirmPassword;
    var query = "insert into companies (name, address, phone_number, email, password) values ('" + name + "' , '" + address + "' , '" + phoneNumber + "' , '" + email + "', '" + password + "')";
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback();
    });
}

function getRestaurant(id, callback) {
    var query = "select * from companies where id =" + id;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}

// random functions for the register page
