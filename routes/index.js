const express = require('express');
const router = express.Router();
const myFuctions = require('./myFunctions')

/* GET home page. */
router.get('/', myFuctions.isLoggedIn, function (req, res, next) {
    res.render('index', {title: 'TableEase'});
});

module.exports = router;
