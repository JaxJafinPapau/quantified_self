'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Food", [
      {
        name: "Chicken",
        calories: 165,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Beef",
        calories: 345,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Broccoli",
        calories: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Milk",
        calories: 124,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Butter",
        calories: 102,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Food", null, {})
  }
};
