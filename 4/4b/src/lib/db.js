const {Sequelize} = require("sequelize");

const db = new Sequelize({
   host: "localhost",
   dialect: "mysql",
   port: 3306,
   username: "root",
   password: "",
   database: "web_wiki",
   ssl: true,
});

module.exports = db;