const mongoose = require('mongoose');

const pedidoSchema = mongoose.Schema({
  producto: {
    nombre: { type: String, required: [true, "El nombre del producto es obligatorio."] },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    cantidad: { type: Number, required: [true, "La cantidad del producto es obligatoria."], min: [1, 'La cantidad debe ser mayor o igual a 1.'] }
  },
  direccion: { type: String },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "El ID del usuario es obligatorio."] },
  idVendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  valorTotal: { type: Number },
  isEnabled: { type: Boolean, default: true },
  comentarios: { type: String, default: "" },
  calificacion: {
    type: Number,
    default: 0,
    min: [0, "La calificación mínima permitida es 0."],
    max: [5, "La calificación máxima permitida es 5."]
  }
},
  { timestamps: true });

export default mongoose.model('Pedido', pedidoSchema);
