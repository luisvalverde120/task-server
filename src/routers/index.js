const { Router } = require("express");
const router = Router();
const { login, register } = require("../controllers/auth-controller");
const {
  createTask,
  getTaskByDate,
  getTaskByRangeDate,
} = require("../controllers/task-controllers");
const verifyToken = require("../middlewares/auth");
const { updatePassword } = require("../controllers/user-controllers");

router.post("/login", login);
router.post("/register", register);
router.post("/create-task", verifyToken, createTask);
router.post("/get-task-by-date", verifyToken, getTaskByDate);
router.post("/update-password", verifyToken, updatePassword);
router.post("/get-task-by-range-date", verifyToken, getTaskByRangeDate);

module.exports = router;
