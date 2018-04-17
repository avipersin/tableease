const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt-nodejs');
const db = require('../config/db');

/* GET users listing. */
router.get('/companyId/password/:companyId/:password/', function (req, res, next) {
    var companyId = req.params.companyId
    var password = bcrypt.hashSync(req.params.password, null, null)

    var query = "update companies set password='" + password + "' where id = " + companyId;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        console.log(JSON.stringify(rows))
        res.render('action', {data: JSON.stringify(rows)});
    });
});

module.exports = router;