import mongoose from 'mongoose'

const onlyUser = function () { return this.role === 'user' }

const userSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },

  // Comunes a user y admin
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },

  // Solo para role 'user'
  firstName: { type: String, trim: true, required: onlyUser },
  lastName:  { type: String, trim: true, required: onlyUser },
  dni:       { type: String, unique: true, sparse: true, trim: true, required: onlyUser },
  phone:     { type: String, trim: true, required: onlyUser },
  address: {
    street:    { type: String, required: onlyUser },
    number:    { type: String, required: onlyUser },
    floor:     { type: String, default: '' },
    apartment: { type: String, default: '' },
    city:      { type: String, required: onlyUser },
    province:  { type: String, required: onlyUser }
  },

  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
