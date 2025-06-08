import express from 'express'
import AssetFlowController from '../controller/AssetFlowController'
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router()

router.post('/paginate',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetFlowController.getAssetFlows)
router.post('/',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetFlowController.createAssetFlow)
router.get('/suggest-code',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetFlowController.genNextAssetCode)
router.get("/active-flows",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetFlowController.getActiveAssetFlows);
router.get('/:id',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), AssetFlowController.getAssetFlowById)
router.put('/:id',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetFlowController.updateAssetFlow)
router.delete('/:id',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF), AssetFlowController.deleteAssetFlow)

export default router
