const express = require('express');
const router = express.Router();
const db = require('../config/db');
const myFunctions = require("./myFunctions");
const async = require("async");


/* GET home page. */
router.get('/', myFunctions.isLoggedIn, function (req, res, next) {
    getAllergies(function (rows) {
        res.render('menu', {allergies: rows, message: req.flash("menuMessage")});
    });
});


router.get('/edit', myFunctions.isLoggedIn, function (req, res, next) {
    var companyId = req.user.id;
    async.waterfall([
        async.apply(getMenuIds, companyId),
        async.apply(getAllergiesMenu, companyId),
        function (jsonReturn) {
            res.render('myMenu', {data: jsonReturn})
        }])
});

router.post('/post', myFunctions.isLoggedIn, function (req, res, next) {
    var companyId = req.user.id;
    addFood(req, companyId, function (formFields) {
        req.flash('menuMessage', "Added: " + JSON.stringify(formFields));
        res.redirect('/menu');
    });

});

router.get('/delete/:id', myFunctions.isLoggedIn, function (req, res, next) {
    var companyId = req.user.id;
    var foodId = req.params.id;
    checkOwnerFood(foodId, companyId, function (row) {
        if (!row) {
            res.render("action", {data: "You do not own that menu item OR it does not exist."});
        }
        else {
            deleteFoodAllergies(foodId, companyId, function (result) {
                res.redirect("/menu/edit");
            })
        }

    })
});

router.post('/update/:id', myFunctions.isLoggedIn, function (req, res, next) {
    var foodId = req.params.id;
    var companyId = req.user.id;
    checkOwnerFood(foodId, companyId, function (row) {
        if (!row) {
            res.render("action", {data: "You do not own that menu item OR it does not exist."});
        }
        else {
            deleteFoodAllergies(foodId, companyId, function (result) {
                addFood(req, function (formFields) {
                    res.redirect("/menu/edit");
                })
            })
        }
    })
});


router.get('/:id', myFunctions.isLoggedIn, function (req, res, next) {
    var companyId = req.user.id;
    var foodId = req.params.id;
    async.waterfall([
        async.apply(getMenuItem, companyId, foodId),
        getAllergiesFood,
        function (row) {
            getAllergies(function (allergies) {
                res.render('food', {allergies: allergies, data: row})
            })
        }
    ], function (err, row) {
        res.render("action", {data: err});
    })
});

module.exports = router;

// mysql functions related to register


function getAllergiesMenu(companyId, rows, callback) {
    var jsonReturn = [];
    async.each(rows, function (row, callback1) {
        getMenuItem(companyId, row.id, function (err, row) {
            getAllergiesFood(row, function (err, allergyRow) {
                jsonReturn.push(allergyRow);
                callback1();
            });
        })

    }, function (err) {
        callback(err, jsonReturn)
    })
}

function setAllergyList(allergies, row, callback) {
    var allergyList = [];
    var allergyIds = [];
    async.each(allergies, function (allergy, callback1) {
        convertIdAllergy(allergy.allergy_id, function (name) {
            allergyList.push(name);
            allergyIds.push(allergy.allergy_id);
            callback1();
        })
    }, function (err) {
        row.allergyNames = allergyList;
        row.allergyIds = allergyIds;
        callback();
    });
}

function getAllergiesFood(row, callback) {
    if (!row) {
        callback("You do not own that menu item OR it does not exist.", null);
        return 0;
    }
    else {
        var foodId = row.id;
        getAllergiesForFood(foodId, function (allergies) {
            setAllergyList(allergies, row, function () {
                callback(null, row)
            })
        })
    }
}

function getAllergies(callback) {
    var query = "select * from allergies";
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        return callback(rows);
    });
}

function addFood(req, companyId, callback) {
    var formFields = req.body;
    var name = formFields.name;
    var description = formFields.description;
    var foodInsertQuery = "insert into food (name, company_id, description) values ('" + name + "' , '" + companyId + "' , '" + description + "')";
    db.query(foodInsertQuery, function (err, rows, fields) {
        if (err) throw err;
        var rowId = rows.insertId;
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

function getMenuIds(companyId, callback) {
    var query = "select id from food where company_id =" + companyId;
    db.query(query, function (err, rows, fields) {
        if (err) throw err;
        callback(null, rows)
    })
}

function getMenuItem(companyId, foodId, callback) {
    var query = "select * from food where company_id =" + companyId + " and id=" + foodId;
    db.query(query, function (err, row, fields) {
        if (err) throw err;
        callback(null, row[0])
    })
}

function getAllergiesForFood(foodId, callback) {
    var query = "select * from food_allergy where food_id =" + foodId;
    db.query(query, function (err, allergies, fields) {
        if (err) throw err;
        return callback(allergies);
    })
}

function convertIdAllergy(allergyId, callback) {
    var query = "select name from allergies where id =" + allergyId;
    db.query(query, function (err, name, fields) {
        if (err) throw err;
        return callback(name[0].name);
    })
}

function deleteFood(foodId, companyId) {
    var query = "delete from food where id =" + foodId + " and company_id=" + companyId;
    db.query(query, function (err, res, fields) {
        if (err) throw err;
        return res;
    })
}

function deleteFoodAllergies(foodId, companyId, callback) {
    var query = "delete from food_allergy where food_id =" + foodId;
    db.query(query, function (err, name, fields) {
        if (err) throw err;
        return callback(deleteFood(foodId, companyId));
    })
}

function checkOwnerFood(foodId, companyId, callback) {
    var query = "SELECT * FROM food WHERE company_id =" + companyId + " and id =" + foodId;
    db.query(query, function (err, row, fields) {
        if (err) throw err;
        return callback(row[0]);
    })
}


// random functions for the register page
