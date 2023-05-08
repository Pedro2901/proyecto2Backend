import { createPedido, getPedidoById, getPedidos, putPedido } from "./pedidoController";
import { Router } from 'express';
const router = Router();

// Endpoint POST
router.post('/', createPedido);

// Endpoint GET
router.get('/', getPedidoById);

// Endpoint PUT
router.get('/', getPedidos);

// Endpoint DELETE
router.put('/', putPedido);

export default router;