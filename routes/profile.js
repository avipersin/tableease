const express = require('express');
const router = express.Router();
const myFunctions = require("./myFunctions")


router.get('/', myFunctions.isLoggedIn, function (req, res) {
    res.render('profile', {user: req.user, message: req.flash('signupMessage')});
});
module.exports = router;
