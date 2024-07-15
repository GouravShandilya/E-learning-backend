const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const todoRoutes = require("./routes/todo.js");

mongoose
  .connect("mongodb://localhost:27017/todo_db")
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(userRoutes);
app.use(todoRoutes);

module.exports = app;
