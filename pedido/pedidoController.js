import Pedido from './pedidoModel';
import User from '../usuario/userModel';
import Product from '../producto/productoModel';

// ------------------------------------------- CRUD de pedidos ------------------------------------------------

//Crear un pedido de un producto 
export async function createPedido(req, res) {
  const { idUsuario } = req;
  if (!idUsuario) return res.status(403).json({ message: 'Usuario no autorizado' });
  try {
    const { producto, idVendedor } = req.body;

    const usuario = await User.findById(idUsuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });
    if (!usuario.isEnabled) return res.status(403).json({ message: 'No se puede crear el pedido, el usuario no está activo.' });

    const vendedor = await User.findById(idVendedor);
    if (!vendedor) return res.status(404).json({ message: 'Vendedor no encontrado.' });
    if (!vendedor.isEnabled) return res.status(403).json({ message: 'No se puede crear el pedido, el vendedor no está activo.' });

    const prodbyID = await Product.findOne({ userId: idVendedor, name: producto.nombre, isEnabled: true });
    if (!prodbyID) return res.status(400).json({ message: 'No se encontró el producto en el inventario del vendedor' });

    const { _id: idProducto, price } = prodbyID;
    const valorTotal = producto.cantidad * price;
    const newproducto = { nombre: producto.nombre, idProducto, cantidad: producto.cantidad };

    const direccion = usuario.direccion;
    const pedido = new Pedido({ idUsuario, idVendedor, direccion, producto: newproducto, valorTotal });

    const resultado = await pedido.save();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error creando el pedido:', error.message);
    return res.status(500).json({ error: 'Error al crear pedido.' });
  }
}

//Retornar datos de pedidos según la _id
export async function getPedidoById(req, res) {
  const { idUsuario } = req;
  if (!idUsuario) return res.status(403).json({ message: 'Usuario no autorizado' });

  try {
    const pedido = await Pedido.findOne({ _id: req.params._id, isEnabled: true });
    if (!pedido) return res.status(404).json({ message: 'No se encontró pedido con esa ID o está inhabilitado.' });

    const vendedor = await User.findById(pedido.idVendedor);
    const usuario = await User.findById(pedido.idUsuario);

    if (pedido.idUsuario != idUsuario) return res.status(403).json({ message: 'El usuario actual no está autorizado porque no es dueño del pedido.' });
    
    if (!vendedor.isEnabled) return res.status(403).json({ message: 'No se puede encontrar el pedido, el vendedor no está activo.' });
    if (!usuario.isEnabled) return res.status(403).json({ message: 'No se puede encontrar el pedido, el usuario no está activo.' });

    return res.status(200).json(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error.message);
    return res.status(500).json({ error: 'Error al obtener el pedido.' });
  }
}

//Retorna datos de pedidos REALIZADOS por un usuario y/o entre las fechas dadas
//Formato fechaInicio, fechaFin: DD/MM/AAAA hh:mm:ss
export async function getPedidos(req, res) {
  const { idUsuario } = req;
  if (!idUsuario) return res.status(403).json({ message: 'Usuario no autorizado' });

  try {
    const { fechaInicio, fechaFin } = req.query;
    const query = { isEnabled: true };

    const fechaI = fechaInicio ? new Date(fechaInicio.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6Z')) : null;
    const fechaF = fechaFin ? new Date(fechaFin.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6Z')) : null;

    query.idUsuario = idUsuario;
    const cliente = await User.findById(idUsuario);
    if (!cliente.isEnabled) return res.status(403).json({ message: 'No se pueden obtener pedidos, el usuario no está activo' });

    if (fechaI && fechaF) {
      query.createdAt = { $gte: fechaI, $lte: fechaF }; //$gte (mayor o igual que) y $lte (menor o igual que)
    } else if (fechaI) {
      query.createdAt = { $gte: fechaI };
    } else if (fechaF) {
      query.createdAt = { $lte: fechaF };
    }

    const pedidos = await Pedido.find(query);
    pedidos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (!pedidos.length) return res.status(404).json({ message: 'No se encontraron pedidos con los datos proveídos.' });
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
}

//Modificar la calificación y comentarios del pedido.
export async function putPedido(req, res) {
  const { idUsuario } = req;
  if (!idUsuario) return res.status(403).json({ message: 'Usuario no autorizado' });

  try {
    const { comentarios, calificacion } = req.body;

    const pedido = await Pedido.findById(req.params._id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' })
    if (!pedido.isEnabled) return res.status(400).json({ message: 'El pedido no está activo, no puede modificar.' });

    const usuario = await User.findById(idUsuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (!usuario.isEnabled) return res.status(400).json({ message: 'El usuario no está activo, no puede modificar el pedido.' });
    if (pedido.idUsuario != idUsuario) return res.status(403).json({ message: 'El usuario actual no está autorizado porque no es dueño del pedido.' });

    if (calificacion && calificacion > 5 || calificacion < 0) return res.status(400).json({ message: 'La calificación solo puede ser en el rango de 0 a 5' });

    const pedidoUpdated = await Pedido.findByIdAndUpdate(req.params._id, {
      comentarios,
      calificacion
    }, { new: true });

    return res.status(200).json(pedidoUpdated);
  } catch (err) {
    return res.status(500).json({ message: 'Error al actualizar el pedido.' });
  }
}