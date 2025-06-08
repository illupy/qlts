import express from "express"
import userController from "../controller/UserController"
import { authMiddleware } from "../middlewares/AuthMiddleware"

const router = express.Router()

// GET all users (protected) "/users"
router.get("/", authMiddleware, userController.all)

export default router
