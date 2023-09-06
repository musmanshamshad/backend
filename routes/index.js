/** @format */
const errorHandler = require("../middlewares/errorHandler");
const users = require("./users");
const systemUsers = require("./systemUser");
const gradeLevel = require("./grades");
const subject = require("./subjects");
const course = require("./course");
const unit = require("./unit");
const snack = require("./snack");
const chapter = require("./chapter");
const tag = require("./tags");

const curriculum = require("./curriculum");
module.exports = function (app) {
  app.get("/", (req, res, next) => {
    return res.json({ msg: "Welcome to OctiLearn APIS." });
  });
  app.use("/api/user", users);
  app.use("/api/system-user", systemUsers);
  app.use("/api/curriculum", curriculum);
  app.use("/api/grade-level", gradeLevel);
  app.use("/api/course", course);
  app.use("/api/subject", subject);
  app.use("/api/unit", unit);
  app.use("/api/snack", snack);
  app.use("/api/chapter", chapter);
  app.use("/api/note", require("./notes"));
  app.use("/api/flashcard", require("./flashcards"));
  app.use("/api/tag", tag);
  app.use("/api/recently-visited", require("./lastVisited"));
  app.use("/api/auth", require("./auth"));
  app.use("/api/lo", require("./lo"));
  app.use("/api/my-library", require("./myLibrary"));
  app.use("/api/highlight", require("./highlight"));
  app.use("/api/comment", require("./comment"));
  app.use("/api/userLoObj", require("./userLeanObj"));


  // error middleware
  app.use(errorHandler);
};
