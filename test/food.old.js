var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Food = require('../models').Food;

// describe('Test the root path', () => {
//   test('It should respond to the GET method', () => {
//     return request(app).get("/").then(response => {
//       expect(response.statusCode).toBe(200)
//     })
//   });
// });

describe('api', () => {
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
              .get('/api/v1/foods/100')
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
                let updatedFoodCount = await Food.findAll()
                expect(updatedFoodCount.length).toBe((foodCount - 1))
                })
    })
    test('DELETE /api/v1/foods/:id with invalid ID', async function(){
      let banana_params = {"name": "Banana", "calories": 150};
      let banana = await Food.create(banana_params);

      return request(app)
              .delete(`/api/v1/foods/52234`)
              .send()
              .then(response => {
                expect(response.statusCode).toBe(404);
      })
    })
  })
})
