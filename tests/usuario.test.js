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

const MONGO_URI =
  'mongodb+srv://' +
  process.env.MONGO_USER +
  ':' +
  process.env.MONGO_PASS +
  '@clusterproyecto2.7vocydo.mongodb.net/BD-Proyecto2?retryWrites=true&w=majority';
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
      body: JSON.stringify(data),
    };
  },
};

it('Test crear usuario con campos requeridos y rol por defecto', async () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'testpassword',
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
      roles: ['admin'],
    },
  };
  const res = {
    json: jest.fn(),
  };
  await createUser(req, res);
  expect(res.json).toHaveBeenCalled();
});

it('Test la creación de un usuario al que le faltan campos obligatorios', async () => {
  const req = {
    body: {
      email: 'testuser@test.com',
      password: 'testpassword',
    },
  };
  const res = {
    json: jest.fn(),
  };
  await createUser(req, res);
  expect(res.json).toHaveBeenCalledWith({ message: 'Please enter all required fields' });
});

it('Test de la creación de un usuario con formato de correo electrónico no válido', async () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'invalidemail',
      password: 'testpassword',
    },
  };
  const res = {
    json: jest.fn(),
  };
  await createUser(req, res);
  expect(res.json).toHaveBeenCalledWith({ message: 'Please enter a valid email address' });
});


it('Test de la creación de un usuario con campos requeridos y dirección', async () => {
  const req = {
    body: {
      username: 'Juanposky',
      email: 'juanp@gmail.com',
      password: '123456789',
      direccion: 'Av Siempre Viva',
    },
  };
  const res = {
    json: jest.fn(),
  };
  await createUser(req, res);
  expect(res.json).toHaveBeenCalled();
});






it('Test que el token contiene el ID del usuario.', async () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'testpassword',
    },
  };
  const res = {
    json: jest.fn(),
  };
  await createUser(req, res);
  const token = res.json.mock.calls[0][0].token;
  const decodedToken = jwt.verify(token, config.SECRET);
  expect(decodedToken.id).toBeDefined();
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

it('Test que el usuario con el id dado se ha encontrado y actualizado correctamente', async () => {
  const mockUser = {
    _id: '123',
    isEnabled: true,
  };
  const mockReq = {
    params: {
      id: '123',
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
  const req = { body: { email: 'test@test.com', password: 'password' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
  await GetUser(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
});
