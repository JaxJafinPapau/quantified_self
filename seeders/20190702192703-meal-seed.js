'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Meals", [
      {
        name: "Breakfast",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lunch",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Dinner",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Fourth Meal",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Meals", null, {})

  }
};
