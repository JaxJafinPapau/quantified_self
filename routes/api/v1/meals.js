var express = require('express');
var router = express.Router();
var Meal = require('../../../models').Meal;
var Food = require('../../../models').Food;
var MealFood = require('../../../models').MealFood;
var defaultHeader = ["Content-Type", "application/json"];

router.post('/:meal_id/foods/:id', async function(req, res, next){
  try{
    let meal = await Meal.findByPk(req.params.meal_id);
    let food = await Food.findByPk(req.params.id);
    if (meal != null && food != null){
      await MealFood.create({FoodId: food.id, MealId: meal.id})
      res.setHeader(...defaultHeader);
      let message = `Successfully added ${food.name} to ${meal.name}`
      res.status(201).send({message: message});
    } else {
      throw "Invalid Parameters"
    }
  } catch (error){
    res.setHeader(...defaultHeader);
    res.status(404).send({ error: error});
  }
})

router.get('/', async function(req, res, next){
  let meals = await Meal.findAll(
    {
      attributes: [ "id", "name"],
      include: [{
        model: Food,
        as: 'foods',
        attributes:["id","name", "calories"],
        through: {
          attributes:[]
        }
      }]
    }
  )

  res.setHeader(...defaultHeader);
  res.status(200).send(meals);

})

router.get('/:meal_id/foods', async function(req, res, next){
  res.setHeader(...defaultHeader)
  try {
    let meal = await Meal.findByPk(req.params.meal_id, {
      attributes: [ "id", "name"],
      include: [{
        model: Food,
        as: 'foods',
        attributes:["id","name", "calories"],
        through: {
          attributes:[]
        }
      }]
    });
    if(meal!= null){ res.status(200).send(meal);}
    else{
      throw "Invalid Parameters";
    }
  }
  catch (error){
    res.status(404).send({error: error});
  }
})

module.exports = router;
