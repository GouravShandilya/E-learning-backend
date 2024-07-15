const express = require("express");

const router = express.Router();
const todoControler = require("./../controlers/todo");

router.get("/todo", todoControler.getTodo);
router.post("/todo/mark/complete", todoControler.markAsTrue);
router.post("/todo/update", todoControler.editTodo);
router.post("/todo/add", todoControler.addTodo);
router.post("/todo/delete", todoControler.deleteTodo);

module.exports = router;    
