const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  category:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price:     { type: Number, required: true, min: 0 },
  unit:      { type: String, enum: ['kg', 'unit'], required: true },
  image:     { type: String, default: '' },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

productSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Product', productSchema)
