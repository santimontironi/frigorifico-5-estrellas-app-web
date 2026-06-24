const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nameSnapshot:  { type: String, required: true },
  priceSnapshot: { type: Number, required: true },
  unitSnapshot:  { type: String, enum: ['kg', 'unit'], required: true },
  quantity:      { type: Number, required: true, min: 0.1 },
  subtotal:      { type: Number, required: true }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [orderItemSchema],

  approximateTotal: { type: Number, required: true },
  finalAmount:      { type: Number, default: null },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'paid', 'in_preparation', 'delivered'],
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

  notes:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

orderSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Order', orderSchema)
