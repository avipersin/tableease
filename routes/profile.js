const express = require('express');
const router = express.Router();


router.get('/', isLoggedIn, function (req, res) {
    res.render('profile', {user: req.user, message: req.flash('signupMessage')});
});
module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
