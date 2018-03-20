const express = require('express');
const router = express.Router();

module.exports = function (passport) {
    router.get('/', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {message: req.flash('loginMessage')});
    });

    router.post('/', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function (req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });
    return router;
};
