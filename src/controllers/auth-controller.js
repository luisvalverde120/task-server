const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const uuid = v4;
const pool = require("../database");
const jwt = require("jsonwebtoken");

async function encryptPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

async function isAlreadyUser(username) {
  const [rows, fields] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (rows.length > 0) {
    return true;
  }
  return false;
}

async function login(req, res) {
  const { username, password } = req.body;

  const isExistUser = isAlreadyUser(username);

  if (!isExistUser) {
    return res.json({ message: "error in username donnot exist", token: "" });
  }

  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    let hash = rows[0].password;

    let isValidPassword = await bcrypt.compare(password, hash);

    if (!isValidPassword) {
      return res
        .status(403)
        .json({ message: "error passwords donnot correct", token: "" });
    }

    const token = jwt.sign({ id: rows[0].id }, process.env.KEY_TOKEN, {
      expiresIn: "4h",
    });

    res.setHeader("access-token", token);

    return res.json({ user: rows[0], token });
  } catch (e) {
    return res.status(400).json({ message: "error in authenticatin" });
  }
}

async function register(req, res) {
  const { username, password, name, lastname } = req.body;
  const id = uuid();
  const hash = await encryptPassword(password);

  const isUsernameExist = isAlreadyUser(username);

  if (isUsernameExist) {
    return res.status(403).json({ message: "usenmae already exist" });
  }

  const token = jwt.sign({ id }, process.env.KEY_TOKEN, {
    expiresIn: "4h",
  });

  try {
    const user = await pool.query(
      `INSERT INTO users VALUES ('${id}', '${username}', '${hash}', '${name}', '${lastname}')`
    );

    res.setHeader("access=token", token);

    return res.json({
      message: "user authenticate successfuly",
      token,
    });
  } catch (e) {
    return res.status(400).json({ message: "error in save user" });
  }
}

module.exports = {
  login,
  register,
};
