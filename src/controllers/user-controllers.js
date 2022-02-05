const pool = require("../database");
const bcrypt = require("bcrypt");

async function updatePassword(req, res) {
  const { password, newPassword, confirmNewPassword } = req.body;
  const id = req.id_user;

  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    const isValidPassword = await bcrypt.compare(password, rows[0].password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "password not valid" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "new password and confirm passowrd is not equals" });
    }

    let hash = await bcrypt.hash(newPassword, 10);

    const newPass = await pool.query(
      `UPDATE users SET password = '${hash}' WHERE id = ?`,
      [id]
    );

    return res.json({ message: "save successfuly" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "error in update password" });
  }
}

module.exports = {
  updatePassword,
};
