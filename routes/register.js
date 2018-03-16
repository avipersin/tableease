const express = require('express');
const router = express.Router();
const db = require('./db');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/company/post', function (req, res, next) {
    var formFields = req.body;
    addCompany(formFields, function () {
        res.render('action', {data: 'Added' + JSON.stringify(formFields)});
    });

});

router.get('/company/:id', function (req, res, next) {
    var id = req.params.id;
    getCompany(id, function (rows) {
        res.render('action', {data: JSON.stringify(rows[0])});
    });

});

module.exports = router;

// mysql functions related to register
function addCompany(formFields, callback) {
    var name = formFields.name;
    var email = formFields.email;
    var phoneNumber = formFields.phoneNumber;
    var password = formFields.password;
    var confirmPassword = formFields.confirmPassword;
    var query = "insert into companies (name, phone_number, email, password) values ('" + name + "' , '" + phoneNumber + "' , '" + email + "', '" + password + "')";
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback;
    });
}

function getCompany(id, callback) {
    var query = "select * from companies where id =" + id;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}