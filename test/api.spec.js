var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Food = require('../models').Food;
var Meal = require('../models').Meal;
var MealFood = require('../models').MealFood;
var {sequelize} = require('../models');


describe('api', () => {
  afterAll(async () => {
    console.log("IN TEARDOWN")
    await sequelize.close();
    await shell.exec('npx sequelize db:drop', {silent: true});
  })
  describe('Test Meal Paths', () => {
    beforeAll(async () => {
      await shell.exec('npx sequelize db:create', {silent: true})
      await shell.exec('npx sequelize db:migrate', {silent: true})
    });
    // beforeEach(async () => {
    // });
    // afterEach(async () => {
    //   await Food.destroy({truncate: true})
    //   await MealFood.destroy({truncate: true})
    //   await Meal.destroy({truncate: true})
    //   // await shell.exec('npx sequelize db:migrate:undo:all', {silent: true})
    // });
    test('POST /api/v1/meals/:meal_id/foods/:id--success', async function() {
      let meal = await Meal.create({"name":"breakfast"});
      let food = await Food.create({"name":"food1", "calories":100});

      let message = `Successfully added ${food.name} to ${meal.name}`
      return request(app)
              .post(`/api/v1/meals/${meal.id}/foods/${food.id}`)
              .then(async function(response) {
                expect(response.statusCode).toBe(201);
                expect(response.body).toHaveProperty("message", message);
                let r = await Food.findByPk(1);
                let relation = await MealFood.findOne({where: {
                  MealId: meal.id,
                  FoodId: food.id
                }})
                expect(relation).not.toBe(null);
              })
    })

    test('POST /api/v1/meals/:meal_id/foods/:id--incorrect meal id; failure', async function(){
      let meal = await Meal.create({"name":"breakfast"});
      let food = await Food.create({"name":"food1", "calories":100});

      return request(app)
              .post(`/api/v1/meals/${meal.id+5}/foods/${food.id}`)
              .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty("error", "Invalid Parameters");
              })
    })

    test('POST /api/v1/meals/:meal_id/foods/:id--incorrect food id; failure', async function(){
      let meal = await Meal.create({"name":"breakfast"});
      let food = await Food.create({"name":"food1", "calories":100});

      return request(app)
              .post(`/api/v1/meals/${meal.id}/foods/${food.id + 5}`)
              .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty("error", "Invalid Parameters");
              })
    })

    test('POST /api/v1/meals/:meal_id/foods/:id--incorrect meal and food ids; failure', async function(){
      let meal = await Meal.create({"name":"breakfast"});
      let food = await Food.create({"name":"food1", "calories":100});

      return request(app)
              .post(`/api/v1/meals/${meal.id + 5}/foods/${food.id + 5}`)
              .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty("error", "Invalid Parameters");
              })
    })

    test('Get /api/v1/meals', async function(){
      let meal1 = await Meal.create(
        {"name":"meal1",
        foods : [{"name":"food1", "calories":100}]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      let meals = await Meal.findAll()
      return request(app)
              .get('/api/v1/meals')
              .then( response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveLength(meals.length);
                for (let meal of response.body ){
                  if(meal.id === meal2.id){
                    expect(meal.name).toBe("meal2");
                    expect(meal.foods).toHaveLength(2);
                    for (let food of meal.foods ){
                      if(food.name === "food2"){
                        expect(food.calories).toBe(200);
                      }
                      else if (food.name === "food3") {
                        expect(food.calories).toBe(300)
                      } else {
                        expect(false).toBe(true)
                      }
                    }
                  }
                }
              })
    })

    test( 'GET /api/v1/meals/:meal_id/foods', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      return request(app)
              .get(`/api/v1/meals/${meal2.id}/foods`)
              .then( response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('id', meal2.id);
                expect(response.body).toHaveProperty('name', meal2.name);
                expect(response.body).toHaveProperty('foods');
                expect(response.body.foods).toHaveLength(2);

                for (let food of response.body.foods ){
                  if(food.name === "food2"){
                    expect(food.calories).toBe(200);
                  }
                  else if (food.name === "food3") {
                    expect(food.calories).toBe(300)
                  } else {
                    expect(false).toBe(true)
                  }
                }
              })
    })

    test( 'GET /api/v1/meals/:meal_id/foods -- Failure', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      return request(app)
              .get(`/api/v1/meals/-1/foods`)
              .then( response => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error', "Invalid Parameters");
              })
    })

    test( 'DELETE /api/v1/meals/:meal_id/foods/:id', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      let foods = await meal2.getFoods({through: MealFood});

      return request(app)
              .delete(`/api/v1/meals/${meal2.id}/foods/${foods[0].id}`)
              .then( async (response) => {
                expect(response.statusCode).toBe(204);

                let remainingFoods = await meal2.getFoods({through: MealFood});
                expect(remainingFoods).toHaveLength(1);
              })

    })

    test( 'DELETE /api/v1/meals/:meal_id/foods/:id invalid meal_id', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      let foods = await meal2.getFoods({through: MealFood});

      return request(app)
              .delete(`/api/v1/meals/-1/foods/${foods[0].id}`)
              .then( async (response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error', "Invalid Parameters")
              })

    })

    test( 'DELETE /api/v1/meals/:meal_id/foods/:id invalid food id', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      let foods = await meal2.getFoods({through: MealFood});

      return request(app)
              .delete(`/api/v1/meals/${meal2.id}/foods/-1`)
              .then( async (response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error', "Invalid Parameters")
              })

    })

    test( 'DELETE /api/v1/meals/:meal_id/foods/:id no valid id', async function(){
      let meal2 = await Meal.create(
        {"name":"meal2",
        foods : [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [{
          model: Food,
          as: 'foods'
        }]}
      );

      let foods = await meal2.getFoods({through: MealFood});

      return request(app)
              .delete(`/api/v1/meals/-1/foods/-1`)
              .then( async (response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error', "Invalid Parameters")
              })

    })

  });

  describe('Test Food Paths', () => {
    beforeAll(async () => {
      await shell.exec('npx sequelize db:create', {silent: true})
      await shell.exec('npx sequelize db:migrate', {silent: true})
    });
    // beforeEach(async () => {
    // });
    // afterEach(async () => {
    //   await Food.destroy({truncate: true})
    //   // await shell.exec('npx sequelize db:migrate:undo:all', {silent: true})
    // });
    test('POST /api/v1/foods with correct params', () => {
      let body = {
        "food" : {
          "name" : "Banana",
          "calories" : 150
        }
      };

      return request(app)
              .post('/api/v1/foods')
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('name', 'Banana');
                expect(response.body).toHaveProperty('calories', 150);
      })
    })
    // sad path
    test('POST /api/v1/foods with incorrect params', () => {
      let body = {
        "food" : {
          "name" : "Banana"
        }
      };

      return request(app)
              .post('/api/v1/foods')
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error', "Invalid Parameters");
      })
    })

    test('GET /api/v1/foods', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let apple_params = {"name": "Apple", "calories": 100};
      let banana = await Food.create(banana_params);
      let apple = await Food.create(apple_params);

      return request(app)
              .get('/api/v1/foods')
              .then(async (response) => {
                Food.findAll().then(foods =>{

                  expect(response.statusCode).toBe(200);
                  expect(response.body).toHaveLength(foods.length);
                });

                // for (let food of response.body){}
                // expect(response.body[0]).toHaveProperty('id', 1);
                // expect(response.body[1]).toHaveProperty('id',2);
              })
    })

    test('GET /api/v1/foods/:id', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let apple_params = {"name": "Apple", "calories": 100};
      let banana = await Food.create(banana_params);
      let apple = await Food.create(apple_params);

      return request(app)
              .get(`/api/v1/foods/${banana.id}`)
              .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('id', banana.id);
                expect(response.body).toHaveProperty('name',"Banana");
                expect(response.body).toHaveProperty('calories',150);
              })
    })
    // sad path
    test('GET /api/v1/foods/:id with non-existant id', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let apple_params = {"name": "Apple", "calories": 100};
      let banana = await Food.create(banana_params);
      let apple = await Food.create(apple_params);


      return request(app)
              .get('/api/v1/foods/-1')
              .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error', "Invalid food ID");
              })
    })

    test('PATCH /api/v1/foods/:id with valid body', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      let new_banana_params = {"name": "Plantain", "calories": 90};
      let body = {
        "food" : new_banana_params
      };
      return request(app)
              .patch(`/api/v1/foods/${banana.id}`)
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('name', 'Plantain');
                expect(response.body).toHaveProperty('calories', 90);
      })
    })
    test('PATCH /api/v1/foods/:id with no calories', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      let new_banana_params = {"name": "Plantain"};
      let body = {
        "food" : new_banana_params
      };
      return request(app)
              .patch(`/api/v1/foods/${banana.id}`)
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error', "Name or calories missing.");
      })
    })
    test('PATCH /api/v1/foods/:id with no name', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      let new_banana_params = {"calories": 1};
      let body = {
        "food" : new_banana_params
      };
      return request(app)
              .patch(`/api/v1/foods/${banana.id}`)
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error', "Name or calories missing.");
      })
    })
    test('PATCH /api/v1/foods/:id with invalid ID', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      let new_banana_params = {"name": "Plantain", "calories": 90};
      let body = {
        "food" : new_banana_params
      };
      return request(app)
              .patch(`/api/v1/foods/1000`)
              .send(body)
              .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error', "Food not found.");
      })
    })
    test('DELETE /api/v1/foods/:id with valid ID', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);
      let allFoods = await Food.findAll()
      let foodCount = allFoods.length

      return request(app)
              .delete(`/api/v1/foods/${banana.id}`)
              .send()
              .then(async function(response) {
                expect(response.statusCode).toBe(204)
                let food = await Food.findByPk(banana.id)
                expect(food).toBe(null)
                })
    })
    test('DELETE /api/v1/foods/:id with invalid ID', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      return request(app)
              .delete(`/api/v1/foods/-1`)
              .send()
              .then(response => {
                expect(response.statusCode).toBe(404);
      })
    })
  })
});
