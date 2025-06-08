import express from "express";
import AssetTypeController from "../controller/AssetTypeController";
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router();

router.post("/paginate",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetTypeController.getAssetTypes);
router.post("/", authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetTypeController.createAssetType);
router.get("/suggest-code", authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetTypeController.genNextHintCode);
router.get("/active-types", authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetTypeController.getActiveAssetTypes);
router.put("/:id", authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetTypeController.updateAssetType);
router.delete("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetTypeController.deleteAssetType);
// Các route CRUD khác...

export default router;