const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./../modals/User.js");
const Todo = require("./../modals/Todo.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const server = express();
const port = 3000;
server.use(cors({ origin: "http://localhost:5173" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/todo_db")
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("db connection failed");
  });

server.get("/", (req, res) => {
  res.send("hello");
});

server.get("/user", async (req, res) => {
  try {
    let user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "not found" });
  }
});
server.post("/signup", async (req, res) => {
  try {
    let users = await User.findOne({ email: req.body.email });
    if (users) return res.json({ message: "user already register" });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = regex.test(req.body.email);
    if (valid == false) res.status(400).json({ message: "email not valid" });

    if (req.body.password) {
      let hashPassword = await bcrypt.hash(req.body.password, 10);
    } else res.status(404).json({ message: "password is required" });

    const user = new User({
      userName: req.body.userName,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    await user.save();
    res.status(200).json({ message: "Signup successfully" });
  } catch (error) {
    res.status(400).json({ message: "signup failed" });
  }
});

server.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ userName: req.body.userName });
    if (!user) res.status(400).json({ message: "user not existed" });
    bcrypt.compare(req.body.password, user.password, (err, data) => {
      if (err) throw err;
      if (data) {
        res.status(200).json({ message: "password matched" });
      } else {
        res.status(400).json({ message: "password not match" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: "login failed" });
  }
});

server.get("/todo", async (req, res) => {
  try {
    let todo = await Todo.find();
    if (todo) res.status(200).json(todo);
    else res.status(400).json({ message: "error to get todo" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
server.post("/todo/add", async (req, res) => {
  try {
    let update = {
      title: req.body.title,
      description: req.body.description,
      time: req.body.time,
    };
    console.log(update, "upate");
    let todo = new Todo(update);
    console.log(todo, "todo");
    await todo.save();
    res.status(200).json({ message: "task added successfully" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
server.post("/todo/update", async (req, res) => {
  try {
    let update = {
      title: req.body.title,
      description: req.body.description,
    };
    let status = await Todo.updateOne({ id: req.query.taskId, $set: update });
    if (status.modifiedCount > 0) res.status(200).json(status);
    else res.status(201).json("id not found");
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
server.post("/todo/mark/complete", async (req, res) => {
  try {
    let update = {
      isCompleted: req.body.isCompleted,
    };
    console.log(req.query.taskId, req.body.isCompleted, "stat");
    let todo = await Todo.findOne({
      _id: req.query.taskId,
    });
    if (!todo) return "no found";
    todo.isCompleted = req.body.isCompleted;
    await todo.save();
    res.status(200).json({ message: "task is completed" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "something went wrong" });
  }
});

server.listen(port, console.log(`server is running on ${port}`));
