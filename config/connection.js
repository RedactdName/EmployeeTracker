const mySQL = require("mysql2");
require("dotenv").config()

const db = mySQL.createConnection(
    {
      host: 'localhost',
        port: 3333, 
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employee_db database.`)
  );
  module.exports = db