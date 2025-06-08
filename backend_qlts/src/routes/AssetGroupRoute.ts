import express from "express";
import AssetGroupController from "../controller/AssetGroupController";
import multer from "multer";
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router();
const upload = multer();

router.post("/paginate", authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetGroupController.getAssetGroups);
router.post("/",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetGroupController.createAssetGroup);
router.post("/import",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), upload.single('file'), AssetGroupController.importAssetGroups);
router.get("/suggest-code",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetGroupController.genNextAssetCode);
router.get("/export-template",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetGroupController.exportAssetGroupsTemplate);
router.get("/export-groups",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetGroupController.exportAssetGroups);
router.get("/active-groups",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetGroupController.getActiveAssetGroups);
router.get("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetGroupController.getAssetGroupById);
router.put("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetGroupController.updateAssetGroup);
router.delete("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetGroupController.deleteAssetGroup);

export default router;
