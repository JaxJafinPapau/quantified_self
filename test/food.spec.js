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
  beforeAll(() => {
    shell.exec('npx sequelize db:create')
  });
  beforeEach(() => {
      shell.exec('npx sequelize db:migrate')
    });
  afterEach(() => {
    shell.exec('npx sequelize db:migrate:undo:all')
  });

  describe('Test Food Paths', () => {
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

    test('GET /api/v1/foods', async function(){
      let banana = {"name": "Banana", "calories": 150, "id" : 1};
      let apple = {"name": "Apple", "calories": 100, "id" : 2};
      await Food.create(banana);
      await Food.create(apple);

      return request(app)
              .get('api/v1/foods')
              .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveLength(2);
                expect(response.body).toContainEqual(banana);
                expect(response.body).toContainEqual(apple);
              })
    })
  })
})
