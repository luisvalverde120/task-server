const express = require("express");
const app = express();
const morgan = require("morgan");
const { json, urlencoded } = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routers/index");
const allowCrossDomain = require("./middlewares/headers");

dotenv.config();

// settings
app.set("port", process.env.PORT_SERVE);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(allowCrossDomain);

// routers
app.use("/api/v1", router);

app.listen(app.get("port"), () => {
  console.log(`listen on port ${app.get("port")}`);
});
