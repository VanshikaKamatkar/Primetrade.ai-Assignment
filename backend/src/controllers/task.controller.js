import Task from "../models/task.model.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      res.status(400);
      throw new Error("Task title is required");
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    throw error;
  }
};

// Get Task
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    throw error;
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title && !description && !status) {
      res.status(400);
      throw new Error("At least one field is required to update");
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Access denied");
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    throw error;
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Access denied");
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
