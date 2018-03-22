const express = require('express');
const router = express.Router();
const db = require('../config/db');
const myFunctions = require("./myFunctions")
var sleep = require('system-sleep');


/* GET home page. */
router.get('/', myFunctions.isLoggedIn, function (req, res, next) {
    getAllergies(function (rows) {
        res.render('menu', {allergies: rows, message: req.flash("menuMessage")});
    });
});

router.get('/edit', function (req, res, next) {
    var companyId = 31;
    getMenu(companyId, function (rows) {
        // rows.forEach(function (row) {
        //     var foodId = row.id;
        //     var allergyList = [];
        //     getAllergiesFood(foodId, function (allergies) {
        //         allergies.forEach(function (allergy) {
        //             allergyList.push(allergy.allergy_id);
        //
        //         });
        //         ret.allergies = allergyList;
        //     });
        // });
        console.log(rows)
        res.render('action', {data: JSON.stringify(rows)});

    });
});

router.post('/post', function (req, res, next) {
    addFood(req, function (formFields) {
        req.flash('menuMessage', "Added: " + JSON.stringify(formFields))
        res.redirect('/menu');
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

function addFood(req, callback) {
    var formFields = req.body;
    var company_id = req.user.id;
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
    return formFields;

}

function getAllergiesFood(foodId, row, callback) {
    var allergyList = [];
    var query = "select * from food_allergy where food_id =" + foodId;
    db.query(query, function (err, allergies, fields) {
        if (err) throw err;
        allergies.forEach(function (allergy) {
            allergyList.push(allergy.allergy_id);
        });
        row.allergies = allergyList;
        return callback(row)
    });
}

function getMenu(companyId, callback) {
    var query = "select * from food where company_id =" + companyId;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return getAllAllergies(rows, callback);
    })
}

function getAllAllergies(rows, callback) {






    rows.forEach(function (row) {
        var foodId = row.id;
        return getAllergiesFood(foodId, row, callback);
    });
}

function combineFoodAllergy(allergies, row, callback) {
    var allergyList = [];
    allergies.forEach(function (allergy) {
        allergyList.push(allergy.allergy_id);
    });
    row.allergies = allergyList;
    return 1;
}

// random functions for the register page
