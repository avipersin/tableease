const express = require('express');
const router = express.Router();

module.exports = {
    isLoggedIn: function (req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
            return next();
        }

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

};



