//importing package files
const mySQL = require("mysql2");
require("dotenv").config()

//connecting to employee_db
const db = mySQL.createConnection(
    {
      host: '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employee_db database.`)
  );

  db.connect(function (err) {
    if (err) throw err;
  });
  module.exports = db