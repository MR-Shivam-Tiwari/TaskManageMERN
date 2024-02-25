const express = require("express");
const router = express.Router();
const Task = require("../Model/Task"); // Update with the correct path

// Create a task (with authentication)
router.post("/tasks", async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      user: req.user ? req.user._id : null, // Associate the task with the authenticated user if available
    };

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a task (without authentication


// Assuming Task model has a 'completed' property
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Assuming you have a route for updating a task
router.put("/taskscompleted/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed: req.body.completed },
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a task
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.taskId },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found.");
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a task
router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.taskId,
    });

    if (!deletedTask) {
      return res.status(404).send("Task not found.");
    }

    res.status(200).json(deletedTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
