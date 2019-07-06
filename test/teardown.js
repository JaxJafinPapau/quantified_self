var {sequelize} = require('../models');
var shell = require('shelljs');

module.exports = async () => {
  sequelize.close();
  await shell.exec('npx sequelize db:drop', {silent: true});

}
