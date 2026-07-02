import userRepository from '../repository/user.repository.js'
import bcrypt from 'bcrypt'

class AdminController {
  async registerAdmin(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' })

      if (await userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      await userRepository.create({ email, password: passwordHash, role: 'admin', confirmed: true })

      return res.status(201).json({ message: 'Admin creado' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const adminController = new AdminController()
export default adminController
