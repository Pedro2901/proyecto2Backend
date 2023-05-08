import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Conexión a MongoDB usando mongoose
mongoose
  .connect(
    'mongodb+srv://' +
    process.env.MONGO_USER +
    ':' +
    process.env.MONGO_PASS +
    '@cluster0.j7xqxtl.mongodb.net/dllo-backend-2023-10',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected.');
  })
  .catch((err) => {
    console.log('There was an error with connection!');
    console.log(err);
  });

// Middlewares
app.use(cors());
app.use(express.json());

import pedidoRoutes from './pedido/pedido.Routes'
app.use('/pedidos', pedidoRoutes)

// Endpoint para 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Inicia app en puerto 8080
app.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 8080');
});
