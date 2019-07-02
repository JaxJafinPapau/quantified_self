var express = require('express');
var router = express.Router();
var Food = require('../../../models').Food

router.post('/', async function(req, res, next) {
  try {
    let food = await Food.create({
      name: req.body.food.name,
      calories: req.body.food.calories
    })
    // I'd like to refactor this setHeader out
    res.setHeader("Content-Type", "application/json")
    res.status(201).send(JSON.stringify(food))
  } catch (error) {
    res.setHeader("Content-Type", "application/json")
    // This error isn't throwing. Instead, the server accepts null values
    // and the only errors that get thrown are sequelize errors that fail
    // validations, such as passing a string for the calories
    res.status(400).send({ error: "Invalid Parameters" })
  }
})

module.exports = router
