const express = require('express');
const router = express.Router();
const db = require('../config/db');

module.exports = function (passport) {
    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('register', {message: req.flash('signupMessage')});
    });

// process the signup form
    router.post('/restaurant', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/register', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    return router;
};

router.get('/restaurant/:id', function (req, res, next) {
    var id = req.params.id;
    getRestaurant(id, function (rows) {
        res.render('action', {data: JSON.stringify(rows)});
    });
});

function getRestaurant(id, callback) {
    var query = "select * from companies where id =" + id;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}
