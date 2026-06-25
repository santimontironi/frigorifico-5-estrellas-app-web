import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  newPrice:  { type: Number, required: true },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Offer', offerSchema)
