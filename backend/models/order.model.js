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

  mercadoPagoPayment: {
    preferenceId: { type: String, default: '' },
    paymentId:    { type: String, default: '' },
    status:       { type: String, default: '' }
  },

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
