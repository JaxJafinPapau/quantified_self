var {sequelize} = require('../models');
module.exports = async () => { sequelize.close()}
