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
    ref: "User", // Assuming you have a User model
  },
  completed: {
    type: Boolean,
    default: false, // Set the default value to false
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
