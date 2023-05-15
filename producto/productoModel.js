import {Schema,model} from "mongoose";

const ProductSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    category: String,
    // Añade aquí cualquier otro campo que quieras para tus productos
    isEnabled: { type: Boolean, default: true }
  });
  
  export default model('Product', ProductSchema);