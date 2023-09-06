const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const routes = require("./routes");

const helmet = require("helmet");
const logger = require("morgan");
require("dotenv").config({});
const cron = require("node-cron");
// put on the helmet :)
app.use(helmet());
app.set("view engine", "ejs");

app.use(require("cors")());
app.use(logger("dev"));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow //
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type,Content-Length,Host,Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent // to the API (e.g. in
  // case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const ENVIROMENT =
  process.env.NODE_ENV === undefined ? "Development" : process.env.NODE_ENV;

if (ENVIROMENT === "Development") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

// middlewares
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(express.static("./uploads"));

routes(app);
// ********************** 404 route handler  ************************
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
// test from nano
app.use((req, res, next) => {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res
      .status(404)
      .json({ data: null, error: "API not found", success: false });
  } else {
    console.log("server error", err);
    return res.json({
      data: null,
      error: "Something went wrong",
      response: null,
    });
  }
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`listening on PORT ${PORT} in ${ENVIROMENT}`);
});
httpServer.setTimeout(200000);
