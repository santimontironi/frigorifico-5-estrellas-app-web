import mongoose from 'mongoose'

// Foto del carrusel del home. La imagen es obligatoria.
// Guardamos también el publicId de Cloudinary para poder borrarla de verdad al eliminarla.
const photoSchema = new mongoose.Schema({
  image:     { type: String, required: true },
  publicId:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Photo', photoSchema)
