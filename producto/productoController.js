import Product from './productoModel'
export const createProduct = async (req, res) => {
  const { name, category, price } = req.body;
  const { userId } = req;

  try {
    const newProduct = new Product({
      name,
      category,
      price, 
      userId
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

