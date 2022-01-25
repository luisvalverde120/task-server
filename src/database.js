const mysql = require("mysql");
const dotenv = require("dotenv");
const { promisify } = require("util");
dotenv.config();

const uri = {
  host: "localhost",
  user: "root",
  password: "",
  database: "tasks",
};

const pool = mysql.createPool(uri);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }
  if (connection) connection.release();
  console.log("db is connected");
  return;
});

promisify(pool.query);

module.exports = pool;
