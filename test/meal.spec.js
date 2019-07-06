var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Food = require('../models').Food;
var Meal = require('../models').Meal;
var MealFood = require('../models').MealFood;

describe('api', () => {

  describe('Test Meal Paths', () => {
    beforeAll(async () => {
      await shell.exec('npx sequelize db:create', {silent: true})
    });
    beforeEach(async () => {
      await shell.exec('npx sequelize db:migrate', {silent: true})
    });
    afterEach(async () => {
      await shell.exec('npx sequelize db:migrate:undo:all', {silent: true})
    });
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
        Food: [{"name":"food1", "calories":100}]},
        {include: [Food]}
      );
      let meal2 = await Meal.create(
        {"name":"meal2",
        Food: [
          {"name":"food2", "calories":200},
          {"name":"food3", "calories":300}
        ]},
        {include: [Food]}
      );

      let meals = Meal.findAll()
      
      return request(app)
              .get('/api/v1/meals')
              .then( response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveLength(meals.length);
                for (let meal of response.body ){
                  if(meal.id === meal2.id){
                    expect(meal.name).toBe("meal2");
                    expect(meal.foods).toHaveLength(2);
                    expect(meal.foods[0]).toHaveProperty("name", "food2");
                    expect(meal.foods[0]).toHaveProperty("calories", "300");
                  }
                }
              })
    })

  })

});
