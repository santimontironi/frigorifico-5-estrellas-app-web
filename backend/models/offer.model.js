const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  discount:  { type: Number, required: true, min: 1, max: 100 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Offer', offerSchema)
