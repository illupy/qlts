import express from 'express'
import PartnerController from '../controller/PartnerController'
import { authMiddleware } from '../middlewares/AuthMiddleware'
import checkRole from '../middlewares/RoleMiddleware'
import { UserRole } from '../constant/AppConstant'
const router = express.Router()

router.post('/paginate',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), PartnerController.getPartners)
router.post('/',checkRole(UserRole.ADMIN, UserRole.STAFF), PartnerController.createPartner)
router.get("/active-partners",authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER), PartnerController.getActivePartners);
router.get('/:id',authMiddleware, checkRole(UserRole.ADMIN, UserRole.STAFF, UserRole.USER),PartnerController.getPartnerById)
router.put('/:id',checkRole(UserRole.ADMIN, UserRole.STAFF), PartnerController.updatePartner)
router.delete('/:id',checkRole(UserRole.ADMIN, UserRole.STAFF), PartnerController.deletePartner)

export default router
