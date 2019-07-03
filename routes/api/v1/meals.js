var express = require('express');
var router = express.Router();
var Meal = require('../../../models').Meal;
var Food = require('../../../models').Food;
var MealFood = require('../../../models').MealFood;
var defaultHeader = ["Content-Type", "application/json"];

router.post('/:meal_id/foods/:id', async function(req, res, next){
  console.log("HERE", req.params);
  try{
    let meal = await Meal.findByPk(req.params.meal_id);
    let food = await Food.findByPk(req.params.id);
    if (meal != null && food != null){
      await MealFood.create({FoodId: food.id, MealId: meal.id})
      res.setHeader(...defaultHeader);
      let message = `Successfully added ${food.name} to ${meal.name}`
      console.log(message);
      res.status(201).send({message: message});
    } else {
      reject();
    }
  } catch {
    res.setHeader(...defaultHeader);
    res.status(404).send({ error: "Invalid Parameters" });
  }
})

module.exports = router;
