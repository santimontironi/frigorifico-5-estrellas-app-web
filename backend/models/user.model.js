import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  dni:        { type: String, required: true, unique: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },
  address: {
    street:    { type: String, required: true },
    number:    { type: String, required: true },
    floor:     { type: String, default: '' },
    apartment: { type: String, default: '' },
    city:      { type: String, required: true },
    province:  { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
