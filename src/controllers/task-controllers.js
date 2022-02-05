const { v4 } = require("uuid");
const uuid = v4;
const pool = require("../database");
const tasks = require("../datas-task");

function isValidState(state) {
  const statelist = ["terminado", "en progreso", "pendiente"];
  for (let i = 0; i < statelist.length; i++) {
    if (state === statelist[i]) {
      return true;
    }
  }

  return false;
}

function isValidTaskType(type_task, task) {
  const tasklist = tasks;
  for (let i = 0; i < tasklist.length; i++) {
    if (type_task === "Otro") {
      return true;
    }
    if (type_task === tasklist[i].type_task) {
      for (let j = 0; i < tasklist[i].task.length; i++) {
        if (task === tasklist[i].task[j]) {
          return true;
        }
      }
    }
  }
  return false;
}

async function createTask(req, res) {
  const { type_task, task, user, date, state } = req.body;
  let observations = req.body.observations || "";
  let time_finish = req.body.time_finish || 0;
  const id_user = req.id_user;
  const id = uuid();

  const ValidTaskType = isValidTaskType(type_task, task);
  const ValidState = isValidState(state);

  if (!ValidTaskType) {
    return res.status(400).json({ message: "error in task type or task" });
  }

  if (!ValidState) {
    return res.status(400).json({ message: "error in state" });
  }

  try {
    const newTask = await pool.query(
      "INSERT INTO tasks_user VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)",
      [
        id,
        state,
        type_task,
        task,
        user,
        observations,
        time_finish,
        date,
        id_user,
      ]
    );

    return res.json({ message: "task create sussefuly" });
  } catch (e) {
    return res.status(400).json({ message: "error in create task" });
  }
}

async function getTaskByDate(req, res) {
  const { date } = req.body;
  const id_user = req.id_user;

  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM tasks_user WHERE id_user = ? AND date = ?",
      [id_user, date]
    );

    return res.json({ task: rows });
  } catch (error) {
    return res.status(400).json({ msesage: "error in request" });
  }
}

async function getTaskByRangeDate(req, res) {
  const { dateInit, dateEnd } = req.body;
  let listTask = [];
  let listUsers = [];
  // yyyy-mm-dd
  let init = new Date(dateInit);
  let end = new Date(dateEnd);

  while (end.getTime() >= init.getTime()) {
    init.setDate(init.getDate() + 1);
    let totalHoursDay = 0;

    aux = `${init.getMonth() + 1}`;
    if (aux.length === 1) {
      month = "0" + aux;
    }

    date = init.getFullYear() + "-" + month + "-" + init.getDate();

    let [rows, fields] = await pool.query(
      `SELECT * FROM tasks_user WHERE id_user = '${req.id_user}' AND date = '${date}'`
    );

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        totalHoursDay += rows[i].time_finish;
      }

      for (let i = 0; i < rows.length; i++) {
        let auxUser = rows[i].user;

        if (listUsers.length === 0) {
          listUsers.push(rows[i].user);
        }

        if (listUsers.length !== 0 && !listUsers.includes(auxUser)) {
          listUsers.push(auxUser);
        }
      }

      listTask.push({
        rows,
        totalHoursDay,
        date,
      });
    }
  }

  res.json({ listTask, auxUser });
}

module.exports = {
  createTask,
  getTaskByDate,
  getTaskByRangeDate,
};
