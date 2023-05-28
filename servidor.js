import express from 'express';
import cors from 'cors';
import userRoutes from './usuario/user.Routes';
import pedidoRoutes from './pedido/pedido.Routes';
import authRoutes from './auth/auth.routes';
import productRoutes from './producto/producto.Routes'
import { createRoles } from './libs/initialSetup'

export function server() {
    const app = express();
    createRoles()
    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Rutas
    app.use('/pedidos', pedidoRoutes)
    app.use('/user', userRoutes)
    app.use('/auth', authRoutes)
    app.use('/product', productRoutes)

    // Endpoint para 404
    app.use((req, res) => {
        res.status(404).json({ message: 'Ruta no encontrada.' });
    });
    return app;
}