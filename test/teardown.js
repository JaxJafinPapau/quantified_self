var {sequelize} = require('../models');
var shell = require('shelljs');

module.exports = async () => {
  console.log("IN TEARDOWN")
  await sequelize.close();
  await shell.exec('npx sequelize db:drop', {silent: true});

}
