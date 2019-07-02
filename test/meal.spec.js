var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Food = require('../models').Food;
var Meal = require('../models').Meal;

// describe('Test the root path', () => {
//   test('It should respond to the GET method', () => {
//     return request(app).get("/").then(response => {
//       expect(response.statusCode).toBe(200)
//     })
//   });
// });

describe('api', () => {
  beforeAll(() => {
    shell.exec('npx sequelize db:create')
  });
  beforeEach(() => {
      shell.exec('npx sequelize db:migrate')
    });
  afterEach(() => {
    shell.exec('npx sequelize db:migrate:undo:all')
  });

  describe('Test Meal Paths', () => {
    describe('POST /api/v1/meals/:meal_id/foods/:id', () => {
      test('success', async function() {
        let meal = await Meal.create({"name":"breakfast"});
        let food = await Food.create({"name":"food1", "calories":100});
        let message = `Successfully added ${food.name} to ${meal.name}`
        return request(app)
                .post(`/api/v1/meals/${meal.id}/foods/${food.id}`)
                .then(response => {
                  expect(response.statusCode).toBe(204);
                  expect(response.body).toHaveProperty("message", message);
                })
      })
    })
  })

});
