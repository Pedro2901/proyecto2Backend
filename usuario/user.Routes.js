import { Router } from "express";
const router = Router();
import {createUser,GetUser,GetUserById,UpdateUserById,DeleteUserById} from './userController'; 

router.post('/', createUser); 
// Agrega las demás rutas aquí:
router.get('/', GetUser);
router.get('/:id', GetUserById);
router.put('/:id', UpdateUserById);
router.delete('/:id', DeleteUserById);

export default router;
