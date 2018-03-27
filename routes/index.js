const express = require('express');
const router = express.Router();
const myFuction = require('./myFunctions')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {user: req.user, title: 'TableEase'});
});

module.exports = router;
