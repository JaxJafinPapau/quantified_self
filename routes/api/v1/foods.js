var express = require('express');
var router = express.Router();
var Food = require('../../../models').Food
var defaultHeader = ["Content-Type", "application/json"];

router.post('/', async function(req, res, next) {
  try {
    let food = await Food.create({
      name: req.body.food.name,
      calories: req.body.food.calories
    })
    res.setHeader(...defaultHeader)
    res.status(201).send(JSON.stringify(food))
  } catch (error) {
    res.setHeader(...defaultHeader)
    res.status(400).send({ error: "Invalid Parameters" })
  }
})

router.get('/', async function(req, res, next){
  try {
    let foods = await Food.findAll();
    res.setHeader(...defaultHeader);
    res.status(200).send(JSON.stringify(foods));
  } catch (error) {
    res.setHeader(...defaultHeader);
    res.status(400).send(error);
  }
})

router.get('/:id', async function(req, res, next){
  try {
    let food = await Food.findByPk(req.params.id);
    if(food != null) {
      res.setHeader(...defaultHeader);
      res.status(200).send(JSON.stringify(food));
    } else {
      // proceed to catch block
      reject();
    }
  } catch (error) {
    res.setHeader(...defaultHeader);
    res.status(400).send({ error: "Invalid food ID" });
  }
})

router.patch('/:id', async function(req, res, next){
  try {
    let food = await Food.findByPk(req.params.id)
    if(food == null) { throw "Food not found." }
    let name = req.body.food.name
    let calories = req.body.food.calories
    if(name == undefined || calories == undefined ) {
      throw "Name or calories missing.";
    }
    let new_food = await food.update({
      name: name,
      calories: calories
    });
    if(new_food != null) {
      res.setHeader(...defaultHeader);
      res.status(200).send(JSON.stringify(new_food))
    } else {
      throw "Update failed."
    }
  } catch(error) {
    res.setHeader(...defaultHeader);
    res.status(400).send({ error: error });
  }
})

router.delete('/:id', async function(req, res, next){
  try {
    let food = await Food.findByPk(req.params.id);
    food.destroy();
    res.setHeader(...defaultHeader);
    res.status(204).send();
  } catch (error) {
    res.setHeader(...defaultHeader);
    res.status(404).send();
  }
})

module.exports = router
