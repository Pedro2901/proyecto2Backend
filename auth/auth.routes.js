import { Router } from 'express'
const router = Router()
import { signUp, signin } from './auth.controller'
router.post('/signup', signUp)
router.post('/signin', signin)
export default router;