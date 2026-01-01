import express from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

// all task routes are protected
router.use(auth);

router.post("/", createTask);
router.get("/", getMyTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
