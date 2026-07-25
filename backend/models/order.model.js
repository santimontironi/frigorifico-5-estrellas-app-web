import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],

  approximateTotal: { type: Number, required: true },
  finalAmount:      { type: Number, default: null },

  status: {
    type: String,
    enum: ['pending', 'rejected', 'paid', 'in_preparation', 'delivered', 'canceled'],
    default: 'pending'
  },

  rejectionReason: { type: String, default: '' },

  // Fecha en la que el pedido queda listo para retirar. La carga el admin al
  // aceptar el pedido (junto con el monto final) y se le avisa al cliente por mail.
  deliveryDate: { type: Date, default: null },

  // Snapshot del domicilio del cliente al momento del pedido. Hoy la modalidad es
  // pago y retiro en el local, así que no se usa para la entrega: se conserva como
  // dato del cliente para cuando se habilite el envío a domicilio.
  deliveryAddress: {
    street:    String,
    number:    String,
    floor:     String,
    apartment: String,
    city:      String,
    province:  String
  },

  notesUser:     { type: String, default: '' },
  notesAdmin:    { type: String, default: '' }
},{
  timestamps: true
})


export default mongoose.model('Order', orderSchema)
