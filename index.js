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
    '@clusterproyecto2.7vocydo.mongodb.net/BD-Proyecto2?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Conectado a la base de datos de MongoDB.');
  })
  .catch((err) => { console.error('Error de conexión a la BD de MongoDB:', err.message); });
mongoose.Promise = global.Promise;

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
