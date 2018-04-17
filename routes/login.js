const express = require('express');
const router = express.Router();

module.exports = function (passport) {
    router.get('/', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {formVals: req.flash('formVals')[0] || [], message: req.flash('loginMessage')});
    });
    router.post('/', function (req, res) {
        req.assert('username', 'Email is not valid!').isEmail();
        req.assert('password', 'Password must be at least 5 characters!').isLength({min: 5});
        const errors = req.validationErrors();
        if (errors) {
            var err_msg = [];
            errors.forEach(function (err) {
                err_msg.push(err.msg);
            });
            req.flash('loginMessage', err_msg);
            req.flash('formVals', req.body);
            return res.redirect('/login');
        }
        else {
            passport.authenticate('local-login', {
                successRedirect: '/profile', // redirect to the secure profile section
                failureRedirect: '/login', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })(req, res),
                function (req, res) {
                    if (req.body.remember) {
                        req.session.cookie.maxAge = 1000 * 60 * 3;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    res.redirect('/');
                };
        }
    });

    return router;
};
