import { server } from './servidor';
import mongoose from 'mongoose';

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

const app = server();

// Inicia app en puerto 8080
app.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 8080');
});