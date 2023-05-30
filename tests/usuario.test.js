import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { server } from '../servidor';
import {
  createUser,
  GetUser,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
} from '../usuario/userController';
import User from '../usuario/userModel';
import Role from '../usuario/RoleModel';
import { verifyToken, isModerator, isAdmin } from '../middlewares';

const MONGO_URI =
  'mongodb+srv://' +
  process.env.MONGO_USER +
  ':' +
  process.env.MONGO_PASS +
  '@clusterproyecto2.7vocydo.mongodb.net/BD-Proyecto2?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET;



const response = {
  status: (statusCode) => {
    this.statusCode = statusCode;
    return this;
  },
  json: (data) => {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(data),
    };
  },
};


describe('User API', () => {
  let token; // Variable para almacenar el token de autenticación

  beforeAll(async () => {
    // Simulación de solicitud de inicio de sesión para obtener un token válido
    const response = await request(app)
      .post('/login')
      .send({ email: 'juanp@gmail.com', password: '123456789' });
    token = response.body.token;
  });

  describe('POST /users', () => {
    it('Deberia crear un nuevo usuario', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
        direccion: '123 Main St',
      };

      const response = await request(app)
        .post('/')
        .set('x-access-token', token)
        .send(newUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.direccion).toBe(newUser.direccion);
    });

    it('Deberia retornar error por valores faltantes', async () => {
      const incompleteUser = {
        username: 'incompleteuser',
        email: 'incompleteuser@example.com',
        password: 'password',
      };

      const response = await request(app)
        .post('/users')
        .set('x-access-token', token)
        .send(incompleteUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Please enter all required fields');
    });
  });


  it('Debe crear un nuevo usuario con campos requeridos y rol por defecto', async () => {
    const response = await request(app)
          .post('/')
          .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword',
            direccion: 'Test Address'
            
          })
          .expect(200);
  
        expect(response.body).toHaveProperty(token);
      });
  
  
  it('Debe obtener un usuario por su ID', async () => {
    const response = await request(app).get('/user/123456789');
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
  });
  
  
  
  it('Test crear usuario con campos requeridos y rol por defecto', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
        direccion:'Soledad'
      },
    };
    const res = {
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.json).toHaveBeenCalled();
  });
  
  
  
  it('Test la creación de un usuario con los campos requeridos y los roles especificados', async () => {
    const role = new Role({ name: 'admin' });
    await role.save();
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
        direccion:'mexico',
        roles: ['admin']
      },
    };
    const res = {
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.json).toHaveBeenCalled();
  });
  
  
  
  it('Test la creación de un usuario al que le faltan campos obligatorios', async () => {
    const response = await request(app)
          .post('/')
          .send({
            username: 'testuser',
            email: 'test@example.com',
          })
          .expect(400);
  
        expect(response.body).toEqual({ message: 'Please enter all required fields' });
      });
  
  it('Test de la creación de un usuario con formato de correo electrónico no válido', async () => {
    const response = await request(app)
    .post('/')
    .send({
      username: 'testuser',
      email: 'testexample.com',
      password: 'testpassword',
      direccion: 'Test Address',
      roles: ['user'],
    })
    .expect(400);
  
  expect(response.body).toEqual({ message: 'El formato del correo electrónico no es válido' });
  });
  
  
  it('Debe establecer el userId en el objeto  si el token es válido', async () => {
    const res = await request(app)
      .get('/')
      .set('x-access-token', token)
      .expect(200);
  
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('userId', '64728065687f82f07f1f2d0b');
  });
  
  
  
  
  
  
  
  
  it('Test de la creación de un usuario con campos requeridos y dirección con rol establecido', async () => {
    const req = {
      body: {
        username: 'Juanposky2',
        email: 'juanp2@gmail.com',
        password: '123456789',
        direccion: 'Av Siempre Viva',
        roles: ['user'],
      },
    };
    const res = {
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.json).toHaveBeenCalled();
  });
  
  
  
  
  
  it('Test a crear un usuario con roles inexistentes.', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
        roles: ['admin'],
      },
    };
    const res = {
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Role not found' });
  });
  
  
  
  
  describe('GET /:id', () => {
    it('Debe regresar los datos de un usuario valido', async () => {
      const response = await request(app)
        .get(`/64728065687f82f07f1f2d0b`)
        .set('x-access-token', token)
        .expect(200);
  
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'testuser');
    });
  
    it('Debe retornar 404 si el ID del usuario es invalido', async () => {
      const response = await request(app)
        .get('/12341234123')
        .set('x-access-token', token)
        .expect(404);
    });
  });
  
  describe('PUT /:id', () => {
    it('Debe actualizar los datos del usuario', async () => {
      const response = await request(app)
        .put(`/64728065687f82f07f1f2d0b`)
        .set('x-access-token', token)
        .send({
          username: 'Juanposkys',
          email: 'juanp@gmail.com',
          password: '123456789',
        })
        .expect(200);
  
      expect(response.body).toEqual({ message: 'User updated successfully' });
    });
  
   
  
  });
  
  it('Test que el usuario con el id dado se ha encontrado y actualizado correctamente', async () => {
    const mockUser = {
      _id: '123',
      isEnabled: true,
    };
    const mockReq = {
      params: {
        id: '1234',
      },
    };
    const mockRes = {
      send: jest.fn(),
    };
    User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);
    await DeleteUserById(mockReq, mockRes);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { isEnabled: false }, { new: true });
    expect(mockRes.send).toHaveBeenCalledWith(mockUser);
  });
  
  x;
  it('Comprueba que la función maneja correctamente el caso en que no se encuentra el usuario con el id dado', async () => {
    const mockReq = {
      params: {
        id: '123',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    await DeleteUserById(mockReq, mockRes);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { isEnabled: false }, { new: true });
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalled();
  });
  
  it('Comprueba que la función devuelve el objeto de usuario correcto cuando se proporciona un identificador de usuario válido.', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'johndoe@example.com',
    };
    const mockReq = {
      params: {
        id: '123',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);
  
    await GetUserById(mockReq, mockRes);
  
    expect(User.findById).toHaveBeenCalledWith('123');
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockUser);
  });
  
  it('test usuario no existe', async () => {
    const mockReq = {
      params: {
        id: '456',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    User.findById = jest.fn().mockResolvedValue(null);
  
    await GetUserById(mockReq, mockRes);
  
    expect(User.findById).toHaveBeenCalledWith('456');
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalled();
  });
  
  it('test formato invalido', async () => {
    const mockReq = {
      params: {
        id: 'invalid',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    await GetUserById(mockReq, mockRes);
  
    expect(User.findById).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalled();
  });
  
  it('test actualizacion exitosa del usuario', async () => {
    const req = {
      params: { id: 'valid_id' },
      body: { username: 'new_username', email: 'new_email', password: 'new_password' },
    };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const user = {
      _id: 'valid_id',
      username: 'old_username',
      email: 'old_email',
      password: 'old_password',
    };
    User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);
  
    await UpdateUserById(req, res);
  
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('valid_id', {
      username: 'new_username',
      email: 'new_email',
      password: 'new_password',
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(user);
  });
  
  it('Comprueba que se devuelve un mensaje de error si se proporciona un ID de usuario no válido', async () => {
    const req = {
      params: { id: '64728065687f82f07f1f1234' },
      body: { username: 'Juanposky', email: 'juanp@gmail.com', password: '123456789' },
    };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
    await UpdateUserById(req, res);
  
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid user ID' });
  });
  
  it('Comprueba que un usuario con correo electrónico correcto pero contraseña incorrecta devuelve un mensaje de error', async () => {
    const req = { body: { email: 'test@test.com', password: 'password' } };
    const res = { json: jest.fn() };
    const userFound = {
      _id: '123',
      email: 'test@test.com',
      password: 'wrongpassword',
      roles: ['user'],
    };
    User.findOne = jest.fn().mockResolvedValue(userFound);
    await GetUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Contaseña incorrecta' });
  });
  
  
  
  
  it(' Comprueba que la función gestiona los errores de la base de datos y JWT.', async () => {
    const req = { body: { email: 'juanp@gmail.com', password: '123456789' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
    await GetUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
  
});

