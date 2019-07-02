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
    res.setHeader(...defaultHeader);
    res.status(200).send(JSON.stringify(food));
  } catch (error) {
    res.setHeader(...defaultHeader);
    res.status(400).send(error);
  }
})

module.exports = router
