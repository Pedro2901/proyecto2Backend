import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { server } from '../servidor';
import { createPedido, getPedidoById, getPedidos, putPedido } from '../pedido/pedidoController';

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
    status: (statusCode) => {
        this.statusCode = statusCode;
        return this;
    },
    json: (data) => {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify(data)
        }
    }
}

describe('Tests controlador pedidos', () => {
    test('Controlador createPedido', async () => {
        const idVendedor = "ID_REAL";
        const producto = {
            nombre: "PROD_REAL",
            cantidad: 23
        }
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            body: {
                idVendedor,
                producto
            }
        }
        const pedidoResponse = await createPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body).producto.nombre).toBe('PROD_REAL');
    })

    test('Controlador createPedido', async () => {
        const idVendedor = "ID_REAL";
        const producto = {
            nombre: "PROD_REAL",
            cantidad: 23
        }
        const idUsuario = "ID_INCORRECTO";
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

    test('Controlador getPedidoById', async () => {
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            params: { _id: "ID_REAL" }
        }
        const pedidoResponse = await getPedidoById(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body)._id).toBe('ID_REAL');
    })

    test('Controlador getPedidoById', async () => {
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            params: { _id: "ID_INEXISTENTE" }
        }
        const pedidoResponse = await getPedidoById(req, response)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(JSON.parse(pedidoResponse.body).message).toBe('No se encontró pedido con esa ID o está inhabilitado.');
    })

    test('Controlador getPedidos', async () => {
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            query: {
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "26/05/2023 23:59:59"
            }
        }
        const pedidoResponse = await getPedidos(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body).idUsuario).toBe('ID_REAL');
    })

    test('Controlador getPedidos', async () => {
        const idUsuario = "ID_INACTIVO";
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

    test('Controlador putPedido', async () => {
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            body: {
                comentarios: "Muy buen producto",
                calificacion: 4
            },
            params: { _id: "ID_PEDIDO_REAL" }
        }
        const pedidoResponse = await putPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(JSON.parse(pedidoResponse.body)._id).toBe('ID_PEDIDO_REAL');
    })

    test('Controlador putPedido', async () => {
        const idUsuario = "ID_REAL";
        const req = {
            idUsuario,
            body: {
                comentarios: "Muy buen producto",
                calificacion: 4
            },
            params: { _id: "ID_PEDIDO_INEXISTENTE" }
        }
        const pedidoResponse = await putPedido(req, response)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(JSON.parse(pedidoResponse.body).message).toBe('Pedido no encontrado');
    })
})

describe('Tests endpoints pedidos', () => {
    let servidor;
    beforeAll(() => {
        servidor = server();
        mongoose.connect(MONGO_URI, {}, (err) => {
            if (err) console.error(err);
            else console.log('Conectado a la base de datos de MongoDB.');
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Endpoint crear pedido', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
            idVendedor: "ID_REAL",
            producto: {
                nombre: "PROD_REAL",
                cantidad: 23
            }
        }
        const pedidoResponse = await request(server)
            .post('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body.producto.nombre).toBe('PROD_REAL');
    })

    test('Endpoint crear pedido', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
            idVendedor: "ID_INCORRECTO",
            producto: {
                nombre: "PROD_REAL",
                cantidad: 23
            }
        }
        const pedidoResponse = await request(server)
            .post('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('Vendedor no encontrado.');
    })

    test('Endpoint retornar datos según id', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(server)
            .get('/pedidos/ID_REAL')
            .set('Authorization', `Bearer ${res.body.token}`)
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body._id).toBe('ID_REAL');
    })

    test('Endpoint retornar datos según id', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(server)
            .get('/pedidos/ID_ERRONEO')
            .set('Authorization', `Bearer ${res.body.token}`)
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('No se encontró pedido con esa ID o está inhabilitado.');
    })

    test('Endpoint retornar pedidos HECHOS por un usuario y/o entre fechas dadas', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(server)
            .get('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .query({
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "26/05/2023 00:00:00"
            })
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body.username).toBe('JuanFran');
    })

    //A revisar
    test('Endpoint retornar pedidos HECHOS por un usuario y/o entre fechas dadas', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('token');

        const pedidoResponse = await request(server)
            .get('/pedidos/')
            .set('Authorization', `Bearer ${res.body.token}`)
            .query({
                fechaInicio: "22/05/2023 00:00:00",
                fechaFin: "26/05/2023 00:00:00"
            })
        expect(pedidoResponse.statusCode).toBe(403);
        expect(pedidoResponse.body.message).toBe('Usuario no autorizado');
    })

    test('Endpoint modificar comentarios y calificación del pedido', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
                comentarios: "Producto regular",
                calificacion: 3
            }
        const pedidoResponse = await request(server)
            .put('/pedidos/ID_PEDIDO_REAL')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(200);
        expect(pedidoResponse.body._id).toBe('ID_PEDIDO_REAL');
    })

    test('Endpoint modificar comentarios y calificación del pedido', async () => {
        const user = { username: 'JuanFran', password: '92420ekjwd' };
        const res = await request(server)
            .post('/auth/signin')
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        const body = {
                comentarios: "Producto regular",
                calificacion: 3
            }
        const pedidoResponse = await request(server)
            .put('/pedidos/ID_PEDIDO_INEXISTENTE')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send(body);
        expect(pedidoResponse.statusCode).toBe(404);
        expect(pedidoResponse.body.message).toBe('Pedido no encontrado');
    })
})