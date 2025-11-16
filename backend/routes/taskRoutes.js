import express from "express";
import { protect,adminOnly } from "../middlewares/authMiddleware.js";
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controller/taskController.js";

const router = express.Router();
//Task Management Route

router.get("/dashboard-data",protect,getDashboardData)
router.get("/user-dashboard-data",protect,getUserDashboardData)
router.get("/",protect,getTasks) // Get all tasks (Admin:all,User:assigned)
router.get("/:id",protect,getTaskById) // Get a specific task (Admin:all,User:assigned)
router.post("/",protect,adminOnly,createTask) // Create a new task (Admin only)
router.put("/:id",protect,adminOnly,updateTask) // Update a task (Admin only)
router.delete("/:id",protect,adminOnly,deleteTask) // Delete a task (Admin only)
router.put("/:id/status",protect,updateTaskStatus) // Update task status (Admin only)
router.put("/:id/todo",protect,updateTaskChecklist) // Update task Checklist 


export default router;
