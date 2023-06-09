import { Router } from "express";
const router = Router();
import { createUser, GetUser, GetUserById, UpdateUserById, DeleteUserById } from './userController';
import { authjwt } from "../middlewares";


router.post('/', createUser);
// Agrega las demás rutas aquí:
router.get('/login', GetUser);
router.get('/:id', GetUserById);
router.put('/:id', [authjwt.verifyToken, authjwt.isAdmin], UpdateUserById);
router.delete('/:id', [authjwt.verifyToken, authjwt.isAdmin], DeleteUserById);

export default router;
