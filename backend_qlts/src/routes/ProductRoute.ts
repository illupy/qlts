import express from "express";
import ProductController from "../controller/ProductController";
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router();

router.post("/paginate",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), ProductController.getProducts);
router.post("/",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), ProductController.createProduct)
router.get("/suggest-code",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), ProductController.genNextProductCode);
router.put("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), ProductController.updateProduct);
router.get("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), ProductController.getProductById);
router.delete("/:id",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), ProductController.deleteProduct);
// Các route CRUD khác...

export default router;