import {Router}from "express"
const router=Router();
const jwt = require('jsonwebtoken');
import {authjwt} from '../middlewares/index';
import { createProduct,getProducts,getProductById,updateProductById,deleteProductById } from "./productoController";


router.post('/create',[authjwt.verifyToken,authjwt.isModerator],createProduct);

router.get('/get',getProducts)

router.get('/:productId',getProductById)

router.get('/:productId',[authjwt.verifyToken,authjwt.isModerator],updateProductById)

router.delete('/productId',[authjwt.verifyToken,authjwt.isModerator],deleteProductById)

export default router;



