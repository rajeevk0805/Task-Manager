import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {  getUserById, getUsers } from "../controller/userController.js";

const router = express.Router();

router.get("/",protect,adminOnly,getUsers) // Get all users(Admin only)
router.get("/:id",protect,getUserById) // Get a specific user

export default router;