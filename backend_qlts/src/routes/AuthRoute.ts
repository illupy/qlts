import * as express from 'express'
import { login, register, logout, getCurrentUser } from '../controller/AuthController'
import { validateLogin, validateRegister } from '../middlewares/ValidateMiddleware'
import { authMiddleware } from '../middlewares/AuthMiddleware'

const router = express.Router()

router.post('/login', validateLogin, login)
router.post('/register', validateRegister, register)
router.post('/logout', logout)
router.get('/me', authMiddleware, getCurrentUser)

export default router
