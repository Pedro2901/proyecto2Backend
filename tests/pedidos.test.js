import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { server } from '../servidor';
import { createPedido, getPedidoById, getPedidos, putPedido } from '../pedido/pedidoController';

config();
const MONGO_URI = 'mongodb+srv://' +
    process.env.MONGO_USER +
    ':' +
    process.env.MONGO_PASS +
    '@clusterproyecto2.7vocydo.mongodb.net/BD-Proyecto2?retryWrites=true&w=majority'
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
}

const response = {
    statusCode: 200,
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    },
    json(data) {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify(data)
        }
    }
}

describe('Tests controlador pedidos', () => {
    let servidor;
    beforeAll(async () => {
        servidor = server();
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Controlador createPedido exitoso', async () => {
        const idVendedor = "64728065687f82f07f1f2d0b";
        const producto = {
            nombre: "Salvavidas",
            cantidad: 23
        }
        const idUsuario = "646d2f247546bd7874f3eb88";
        const req = {
            idUsuario,
            body: {
                idVendedor,
                producto
            }
        }
        const pedidoResponse = await createPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body).producto.nombre).toBe('Salvavidas');
    })

    test('Controlador createPedido erróneo', async () => {
        const idVendedor = "64728065687f82f07f1f2d0b";
        const producto = {
            nombre: "Salvavidas",
            cantidad: 23
        }
        const idUsuario = "646d2f247546bd7874f3eb78";
        const req = {
            idUsuario,
            body: {
                idVendedor,
                producto
            }
        }
        const pedidoResponse = await createPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(JSON.parse(pedidoResponse.body).message).toBe('Usuario no encontrado.');
    })

    test('Controlador getPedidoById exitoso', async () => {
        const idUsuario = "647121766fdeadd8b4933a2c";
        const req = {
            idUsuario,
            params: { _id: "64728f55929403aa2857cd51" }
        }
        const pedidoResponse = await getPedidoById(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body)._id).toBe('64728f55929403aa2857cd51');
    })

    test('Controlador getPedidoById erróneo', async () => {
        const idUsuario = "647121766fdeadd8b4933a2c";
        const req = {
            idUsuario,
            params: { _id: "64728f55929403aa2857cd75" }
        }
        const pedidoResponse = await getPedidoById(req, response)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(JSON.parse(pedidoResponse.body).message).toBe('No se encontró pedido con esa ID o está inhabilitado.');
    })

    test('Controlador getPedidos exitoso', async () => {
        const idUsuario = "647121766fdeadd8b4933a2c";
        const req = {
            idUsuario,
            query: {
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "28/05/2023 23:59:59"
            }
        }
        const pedidoResponse = await getPedidos(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body)).toHaveLength(1);
    })

    test('Controlador getPedidos erróneo', async () => {
        const idUsuario = "647106bd27a49530f668457b";
        const req = {
            idUsuario,
            query: {
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "26/05/2023 23:59:59"
            }
        }
        const pedidoResponse = await getPedidos(req, response)
        expect(pedidoResponse.statusCode).toBe(403);
        expect(JSON.parse(pedidoResponse.body).message).toBe('No se pueden obtener pedidos, el usuario no está activo');
    })

    test('Controlador putPedido exitoso', async () => {
        const idUsuario = "647121766fdeadd8b4933a2c";
        const req = {
            idUsuario,
            body: {
                comentarios: "Muy buen producto",
                calificacion: 4
            },
            params: { _id: "64728f55929403aa2857cd51" }
        }
        const pedidoResponse = await putPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body)._id).toBe('64728f55929403aa2857cd51');
    })

    test('Controlador putPedido erróneo', async () => {
        const idUsuario = "647121766fdeadd8b4933a2c";
        const req = {
            idUsuario,
            body: {
                comentarios: "Muy buen producto",
                calificacion: 4
            },
            params: { _id: "64728f55929403aa2857ed61" }
        }
        const pedidoResponse = await putPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(JSON.parse(pedidoResponse.body).message).toBe('Pedido no encontrado');
    })
})

describe('Tests endpoints pedidos', () => {
    let servidor;
    beforeAll(async () => {
        servidor = server();
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Endpoint crear pedido exitoso', async () => {
        const user = { email: 'juanp@gmail.com', password: '123456789' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
            idVendedor: "64728065687f82f07f1f2d0b",
            producto: {
                nombre: "Salvavidas",
                cantidad: 23
            }
        }
        const pedidoResponse = await request(servidor)
            .post('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body.producto.nombre).toBe('Salvavidas');
    })

    test('Endpoint crear pedido erróneo', async () => {
        const user = { email: 'juanp@gmail.com', password: '123456789' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
            idVendedor: "64728065687f82f07f1f2e1f",
            producto: {
                nombre: "Salvavidas",
                cantidad: 23
            }
        }
        const pedidoResponse = await request(servidor)
            .post('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('Vendedor no encontrado.');
    })

    test('Endpoint retornar datos según id exitoso', async () => {
        const user = { email: 'zlatan@gmail.com', password: 'zlatan' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(servidor)
            .get('/pedidos/64728f55929403aa2857cd51')
            .set('Authorization', `Bearer ${res.body.token}`)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body._id).toBe('64728f55929403aa2857cd51');
    })

    test('Endpoint retornar datos según id erróneo', async () => {
        const user = { email: 'zlatan@gmail.com', password: 'zlatan' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(servidor)
            .get('/pedidos/64728f55929403aa2857ef01')
            .set('Authorization', `Bearer ${res.body.token}`)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('No se encontró pedido con esa ID o está inhabilitado.');
    })

    test('Endpoint retornar pedidos HECHOS por un usuario y/o entre fechas dadas exitoso', async () => {
        const user = { email: 'zlatan@gmail.com', password: 'zlatan' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(servidor)
            .get('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .query({
                fechaInicio: "25/05/2023 00:00:00",
                fechaFin: "29/05/2023 00:00:00"
            })
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body).toHaveLength(1);
    })

    test('Endpoint retornar pedidos HECHOS por un usuario y/o entre fechas dadas erróneo', async () => {
        const user = { email: 'j@gmail.com', password: '123456789' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('User not found');

        const pedidoResponse = await request(servidor)
            .get('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .query({
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "26/05/2023 00:00:00"
            })
        expect(pedidoResponse.statusCode).toBe(401);
        expect(pedidoResponse.body.message).toBe('Token inválido');
    })

    test('Endpoint modificar comentarios y calificación del pedido exitoso', async () => {
        const user = { email: 'zlatan@gmail.com', password: 'zlatan' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
            comentarios: "Producto regular",
            calificacion: 3
        }
        const pedidoResponse = await request(servidor)
            .put('/pedidos/64728f55929403aa2857cd51')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body._id).toBe('64728f55929403aa2857cd51');
    })

    test('Endpoint modificar comentarios y calificación del pedido erróneo', async () => {
        const user = { email: 'zlatan@gmail.com', password: 'zlatan' };
        const res = await request(servidor)
            .get('/user/login')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        const body = {
            comentarios: "Producto regular",
            calificacion: 3
        }
        const pedidoResponse = await request(servidor)
            .put('/pedidos/64728f55929403bb2867cd51')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('Pedido no encontrado');
    })
})