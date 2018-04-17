const express = require('express');
const router = express.Router();
const db = require('../config/db');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('register', {formVals: req.flash('formVals')[0] || {}, message: req.flash('signupMessage')});
    });

    router.post('/restaurant', function (req, res) {
            validateCompany(req, res, function (errors) {
                if (errors) {
                    var err_msg = [];
                    errors.forEach(function (err) {
                        err_msg.push(err.msg);
                    });
                    req.flash('signupMessage', err_msg);
                    req.flash('formVals', req.body);
                    return res.redirect('/register');
                }
                else {
                    passport.authenticate('local-signup', {
                        successRedirect: '/profile', // redirect to the secure profile section
                        failureRedirect: '/register', // redirect back to the signup page if there is an error
                        failureFlash: true // allow flash messages
                    })(req, res);
                }
            });

        });
    return router;
};

router.post('/restaurant/edit', function (req, res, next) {
    validateCompany(req, res, function (errors) {
        if (errors) {
            var err_msg = [];
            errors.forEach(function (err) {
                err_msg.push(err.msg);
            });
            req.flash('signupMessage', err_msg);
            req.flash('formVals', req.body);
            return res.redirect('/profile');
        }
        else {
            var newUserMysql = {
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, null, null),  // use the generateHash function in our user model
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                name: req.body.name
            };

            var insertQuery = "Update companies set email='" + newUserMysql.email + "', password='" + newUserMysql.password +
                "', address='" + newUserMysql.address + "', phone_number='" + newUserMysql.phoneNumber + "', name='" + newUserMysql.name +
                "' where id=" + req.user.id;
            db.query(insertQuery);
            res.render("profile", {user: req.user, message: req.flash('signupMessage')});
        }
    });

});

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

function validateCompany(req, res, callback) {
    req.assert('name', 'Name is a required field!').notEmpty();
    req.assert('email', 'Email is not valid!').isEmail();
    req.assert('password', 'Password must be at least 5 characters!').isLength({min: 5});
    req.assert('confirmPassword', 'Please make sure your passwords match!').equals(req.body.password);
    req.assert('phoneNumber', 'Phone number must be 10 digits!').isLength(10);
    var errors = req.validationErrors();
    return callback(errors);


}
