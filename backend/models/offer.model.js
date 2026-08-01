import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  image:     { type: String, required: false },
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  newPrice:  { type: Number, required: true },
  minQuantity: { type: Number, required: true, default: 1 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Offer', offerSchema)
