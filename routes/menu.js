const express = require('express');
const router = express.Router();
const db = require('../config/db');


/* GET home page. */
router.get('/', function (req, res, next) {
    getAllergies(function (rows) {
        res.render('menu', {allergies: rows});
    });
});

router.post('/post', function (req, res, next) {
    var formFields = req.body;
    addFood(formFields, function () {
        res.render('action', {data: 'Added' + JSON.stringify(formFields)});
    });

});


router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    getAllergiesFood(id, function (rows) {
        res.render('action', {data: JSON.stringify(rows)});
    });
});

module.exports = router;

// mysql functions related to register
function getAllergies(callback) {
    var query = "select * from allergies";
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}

function addFood(formFields, callback) {
    var company_id = 3;
    var name = formFields.name;
    var rowId = 0;
    var description = formFields.description;
    var foodInsertQuery = "insert into food (name, company_id, description) values ('" + name + "' , '" + company_id + "' , '" + description + "')";
    db.query(foodInsertQuery, function (err, rows, fields) {
        if (err) throw err;
        rowId = rows.insertId;
        return callback(addFoodAllergy(rowId, formFields));
    });


}

function addFoodAllergy(rowId, formFields, callback) {
    for (var key in formFields) {
        if (key !== "name" && key !== "description") {
            var foodAllergyInsertQuery = "insert into food_allergy (food_id, allergy_id) values ('" + rowId + "' , '" + formFields[key] + "')";
            db.query(foodAllergyInsertQuery, function (err, rows, fields) {
                if (err) throw err;
            })
        }
    }
    return callback;

}

function getAllergiesFood(id, callback) {
    var query = "select * from food_allergy where food_id =" + id;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}

// random functions for the register page
