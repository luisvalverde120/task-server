const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const uuid = v4;
const pool = require("../database");

async function encryptPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await pool.query(
    "SELECT (id, username, password, name, lastname) FROM users WHERE username = '?'",
    [username]
  );
  console.log(user);

  return res.json();
}

async function register(req, res) {
  const { username, password, name, lastname } = req.body;
  const id = uuid();
  const hash = await encryptPassword(password);

  try {
    pool.query(
      "INSERT INTO users VALUES ('?', '?', '?', '?', '?')",
      [id, username, hash, name, lastname],
      (err, result, fields) => {
        console.log(err);
      }
    );
  } catch (e) {
    return res.status(400).json({ message: "error in save user" });
  }

  let jsonUser = {
    id,
    username,
    name,
    lastname,
  };

  res.json(jsonUser);
}

module.exports = {
  login,
  register,
};
