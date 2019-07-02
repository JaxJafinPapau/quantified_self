const dotenv = require('dotenv');
dotenv.config();

var config = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "quantified_self_development",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "quantified_self_test",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
  },
  "production": {
    "database": "quantified_self_production",
    "dialect": "postgres",
    "operatorsAliases": false,
    "use_env_variable": "DATABASE_URL"
  }
};

module.exports = config;
