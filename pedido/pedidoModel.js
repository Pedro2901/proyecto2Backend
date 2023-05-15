const mongoose = require('mongoose');

const pedidoSchema = mongoose.Schema({
  producto: {
    nombre: { type: String, required: [true, "El nombre del producto es obligatorio."] },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: { type: Number, required: [true, "La cantidad del producto es obligatoria."], min: [1, 'La cantidad debe ser mayor o igual a 1.'] }
  },
  direccion: { type: String },
  idUsuario: { type: String, required: [true, "El ID del usuario es obligatorio."] },
  idVendedor: { type: String, default: "" },
  valorTotal: { type: Number },
  activo: { type: Boolean, default: true },
  comentarios: { type: String },
  calificacion: { type: Number }
}, { timestamps: true });

export default mongoose.model('Pedido', pedidoSchema);
