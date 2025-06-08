import express from "express";
import DashboardController from "../controller/DashboardController";
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router();

router.get("/barchart", authMiddleware, checkRole(UserRole.ADMIN, UserRole.BUL, UserRole.USER), DashboardController.getBarAndPieFigs);
router.get("/linechart",authMiddleware, checkRole(UserRole.ADMIN, UserRole.BUL, UserRole.USER), DashboardController.getProductCountByMonth);
router.get("/product-partner",authMiddleware, checkRole(UserRole.ADMIN, UserRole.BUL, UserRole.USER), DashboardController.getProductCountOfPartner);

export default router;
