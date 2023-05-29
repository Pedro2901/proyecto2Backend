import Product from './productoModel'
export const createProduct = async (req, res) => {
  const { name, category, price } = req.body;
  const { userId } = req;

  Updated upstream
  try {
    const newProduct = new Product({
      name,
      category,
      price,
      userId,
  export const getProducts=async(req,res)=>{
    // Importar los módulos necesarios
const express = require('express');
const app = express();

// Datos de ejemplo (puedes reemplazarlo con tu propia lógica para obtener los productos)
const productos = [
  { id: 1, nombre: 'Producto 1', precio: 10.99 },
  { id: 2, nombre: 'Producto 2', precio: 15.99 },
  { id: 3, nombre: 'Producto 3', precio: 7.99 },
];
  
// Ruta GET para obtener todos los productos
app.get('/productos', (req, res) => {
  // Aquí puedes realizar cualquier lógica adicional, como consultar una base de datos
  const mongoose = require('mongoose');

// Definir el esquema de productos
const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String
});

// Crear un modelo a partir del esquema
const Producto = mongoose.model('Producto', productoSchema);

// Función para obtener todos los productos
async function obtenerProductos() {
  try {
    // Conectarse a la base de datos
    await mongoose.connect('mongodb://localhost:27017/nombre_base_datos', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Obtener todos los productos
    const productos = await Producto.find();

    // Desconectarse de la base de datos
    mongoose.disconnect();

    return productos;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
}

// Ejemplo de uso de la función
obtenerProductos()
  .then(productos => {
    console.log('Productos:', productos);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  // Enviar los productos como respuesta
  res.json(productos);
});

// Iniciar el servidor en el puerto deseado
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

  };

  export const getProductById=async(req,res)=>{
    // Ruta POST para crear un producto de un usuario en la base de datos
app.post('/productos', (req, res) => {
  // Obtener los datos del producto del cuerpo de la solicitud
  const { nombre, precio, userId } = req.body;

  // Validar si se proporcionaron todos los datos necesarios
  if (!nombre || !precio || !userId) {
    return res.status(400).json({ mensaje: 'Se deben proporcionar nombre, precio y userId del producto' });
  }

  // Aquí puedes realizar cualquier lógica adicional, como verificar la existencia del usuario en la base de datos

  // Crear el producto en la base de datos utilizando los datos proporcionados
  const nuevoProducto = {
    nombre,
    precio,
    userId,
    // Otros campos del producto, si los hay
  };

  // Aquí puedes utilizar tu lógica para guardar el producto en la base de datos

  // Enviar una respuesta indicando éxito y el nuevo producto creado
  res.status(201).json({ mensaje: 'Producto creado con éxito', producto: nuevoProducto });
});
  }
  export const readProductById=async(req,res)=>{
    //Ruta GET para obtener los datos de un producto por su ID
app.get('/productos/:id', (req, res) => {
  // Obtener el ID del producto de los parámetros de la URL
  const productId = req.params.id;

  // Buscar el producto con el ID correspondiente
  const producto = productos.find(producto => producto.id === parseInt(productId));

  // Verificar si se encontró el producto
  if (producto) {
    // Enviar los datos del producto como respuesta
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});
  }
  // Ruta GET para obtener los datos de los productos según el usuario, texto de búsqueda y/o categoría
app.get('/productos', (req, res) => {
  // Obtener los parámetros de la consulta
  const { usuario, busqueda, categoria } = req.query;

  // Aquí puedes realizar cualquier lógica adicional, como consultar la base de datos

  // Filtrar los productos según los criterios de usuario, texto de búsqueda y/o categoría
  let productosFiltrados = productos;

  if (usuario) {
    productosFiltrados = productosFiltrados.filter(producto => producto.usuario === usuario);
  }

  if (busqueda) {
    productosFiltrados = productosFiltrados.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  if (categoria) {
    productosFiltrados = productosFiltrados.filter(producto => producto.categoria === categoria);
  }

  // Enviar los datos de los productos filtrados como respuesta
  res.json(productosFiltrados);
});

// Ruta GET para obtener las categorías de los productos según el usuario
app.get('/categorias', (req, res) => {
  // Obtener el parámetro de usuario de la consulta
  const { usuario } = req.query;

  // Aquí puedes realizar cualquier lógica adicional, como consultar la base de datos

  // Obtener las categorías de los productos del usuario
  const categorias = [];

  productos.forEach(producto => {
    if (producto.usuario === usuario && !categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });

  // Enviar las categorías como respuesta
  res.json(categorias);
});


  export const updateProductById=async(req,res)=>{
    app.put('/productos/:id', (req, res) => {
      // Obtener el ID del producto de los parámetros de la URL
      const productId = req.params.id;
    
      // Obtener los nuevos datos del producto del cuerpo de la solicitud
      const { nombre, precio } = req.body;
    
      // Aquí puedes realizar cualquier lógica adicional, como verificar la validez de los datos o actualizar la base de datos
    
      // Actualizar el producto con los nuevos datos
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === parseInt(productId)) {
          productos[i].nombre = nombre;
          productos[i].precio = precio;
          break;
        }
      }
    
      // Enviar una respuesta indicando éxito
      res.json({ mensaje: 'Producto actualizado con éxito' });
>>>>>>> Stashed changes
    });

    const productSaved = await newProduct.save();
    res.status(201).json(productSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getProducts = async (req, res) => {
  // Importar los módulos necesarios
  const express = require('express');
  const app = express();

  // Datos de ejemplo (puedes reemplazarlo con tu propia lógica para obtener los productos)
  const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10.99 },
    { id: 2, nombre: 'Producto 2', precio: 15.99 },
    { id: 3, nombre: 'Producto 3', precio: 7.99 },
  ];

  // Ruta GET para obtener todos los productos
  app.get('/productos', (req, res) => {
    // Aquí puedes realizar cualquier lógica adicional, como consultar una base de datos

    // Enviar los productos como respuesta
    res.json(productos);
  });

  // Iniciar el servidor en el puerto deseado
  app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
  });

};

export const getProductById = async (req, res) => {

}

export const updateProductById = async (req, res) => {
  app.put('/productos/:id', (req, res) => {
    // Obtener el ID del producto de los parámetros de la URL
    const productId = req.params.id;

    // Obtener los nuevos datos del producto del cuerpo de la solicitud
    const { nombre, precio } = req.body;

    // Aquí puedes realizar cualquier lógica adicional, como verificar la validez de los datos o actualizar la base de datos

    // Actualizar el producto con los nuevos datos
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === parseInt(productId)) {
        productos[i].nombre = nombre;
        productos[i].precio = precio;
        break;
      }
    }

    // Enviar una respuesta indicando éxito
    res.json({ mensaje: 'Producto actualizado con éxito' });
  });
}

export const deleteProductById = async (req, res) => {
  // Ruta DELETE para eliminar un producto
  app.delete('/productos/:id', (req, res) => {
    // Obtener el ID del producto de los parámetros de la URL
    const productId = req.params.id;

    // Aquí puedes realizar cualquier lógica adicional, como verificar la validez del ID o eliminar el producto de la base de datos

    // Buscar el índice del producto en el arreglo
    const productIndex = productos.findIndex(producto => producto.id === parseInt(productId));

    // Verificar si se encontró el producto
    if (productIndex !== -1) {
      // Eliminar el producto del arreglo
      productos.splice(productIndex, 1);
      res.json({ mensaje: 'Producto eliminado con éxito' });
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  });
}
  }

