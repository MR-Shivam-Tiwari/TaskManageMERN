const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
