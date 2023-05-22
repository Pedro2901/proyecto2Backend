import {Router}from "express"
const router=Router();
const jwt = require('jsonwebtoken');
import { verifyToken } from '../middlewares/index';
import { createProduct } from "./productoController";


router.post('/',verifyToken,createProduct);

export default router;



