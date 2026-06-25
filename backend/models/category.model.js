import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name:   { type: String, required: true, unique: true, trim: true },
  active: { type: Boolean, default: true }
})

export default mongoose.model('Category', categorySchema)
