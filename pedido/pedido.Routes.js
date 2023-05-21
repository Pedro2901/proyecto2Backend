import { createPedido, getPedidoById, getPedidos, putPedido } from "./pedidoController";
import { Router } from 'express';
import { authWithToken } from '../middlewares/authMiddle';
const router = Router();

// Endpoint POST
router.post('/', authWithToken, createPedido);

// Endpoint GET
router.get('/:_id', authWithToken, getPedidoById);

// Endpoint GET
router.get('/', authWithToken, getPedidos);

// Endpoint PUT
router.put('/:_id', authWithToken, putPedido);

export default router;