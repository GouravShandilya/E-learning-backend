const Todo = require("./../modals/Todo");
const User = require("./../modals/User");

exports.getTodo = async (req, res, next) => {
  try {
    let todo = await Todo.find();
    if (!todo) return res.status(200).json({ message: "todo is empty" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};

exports.editTodo = async (req, res, next) => {
  try {
    let update = {
      title: req.body.title,
      description: req.body.description,
      time: req.body.time,
    };
    let todo = await Todo.updateOne(
      { _id: req.query.taskId },
      { $set: update }
    );
    if (todo.modifiedCount > 0) {
      return res.status(200).json({ message: "successfully updated" });
    } else return res.status(400).json({ message: "taskid not found" });
  } catch (error) {
    console.log(error, "err");
    res.status(400).json({ message: "not found" });
  }
};

exports.markAsTrue = async (req, res, next) => {
  try {
    let todo = await Todo.findOne({ _id: req.query.taskId });
    if (!todo) return res.status(400).json({ message: "todo not found" });
    todo.isCompleted = req.body.isCompleted;
    await todo
      .save()
      .then(() => {
        res.status(200).json({ message: "successfully updated" });
      })
      .catch(() => {
        res.status(200).json({ message: "failed to  update" });
      });
  } catch (error) {
    res.status(400).json({ message: "not found" });
  }
};

exports.addTodo = async (req, res, next) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
      time: req.body.time,
      isCompleted: false,
    });
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await newTodo.save();
    user.todos.push(newTodo);
    await user.save();
    res.status(200).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    console.error(error, "err");
    res.status(400).json({ message: "Failed to add todo" });
  }
};
exports.deleteTodo = async (req, res, next) => {
  try {
    let todo = await Todo.deleteOne({ _id: req.query.taskId });
    console.log(todo, "todo", req.query.taskId, "hello");
    if (todo.deletedCount > 0) {
      return res.status(200).json({ message: "successfully deleted" });
    } else return res.status(400).json({ message: "taskid not found" });
  } catch (error) {
    console.log(error, "err");
    res.status(400).json({ message: "not found" });
  }
};
