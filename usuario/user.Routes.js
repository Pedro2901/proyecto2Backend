import { Router } from "express";
const router = Router();
import {createUser,GetUser,GetUserById,UpdateUserById,DeleteUserById} from '/usuario/userController'; 

router.post('/', UserCtrl.createUser); 
// Agrega las demás rutas aquí:
router.get('/', UserCtrl.GetUser);
router.get('/:id', UserCtrl.GetUserById);
router.put('/:id', UserCtrl.UpdateUserById);
router.delete('/:id', UserCtrl.DeleteUserById);

export default router;
