var express = require('express');
var router = express.Router();
var Meal = require('../../../models').Meal;
var Food = require('../../../models').Food;
var defaultHeader = ["Content-Type", "application/json"];

router.get('/:meal_id/foods/:id', async function(req, res, next){

})
