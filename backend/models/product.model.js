import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  category:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price:     { type: Number, required: true, min: 0 },
  unit:      { type: String, enum: ['kg', 'unit'], required: true },
  active:    { type: Boolean, default: true },
},{
  timestamps: true
})

export default mongoose.model('Product', productSchema)

