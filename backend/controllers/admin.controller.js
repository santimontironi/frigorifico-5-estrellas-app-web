import adminRepository from '../repository/admin.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieOptions from '../config/cookie.js'

class AdminController {
  async registerAdmin(req, res) {
    try {
      const { username, password } = req.body

      if (!username || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' })

      const passwordHash = await bcrypt.hash(password, 10)
      await adminRepository.createAdmin({ username, password: passwordHash })

      return res.status(201).json({ message: 'Admin creado' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body

      if (!username || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' })

      const admin = await adminRepository.findAdminByUsername(username)
      if (!admin) return res.status(404).json({ message: 'Admin no encontrado' })

      const passwordMatch = await bcrypt.compare(password, admin.password)
      if (!passwordMatch) return res.status(401).json({ message: 'Contraseña incorrecta' })

      const role = 'admin'
      const token = jwt.sign({ id: admin._id, role }, process.env.JWT_SECRET, { expiresIn: '3d' })

      res.cookie('token', token, cookieOptions)
      return res.status(200).json({ id: admin._id, role })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async dashboard(req, res) {
    try {
      const admin = await adminRepository.findAdminById(req.auth.id)
      if (!admin) return res.status(404).json({ message: 'Admin no encontrado' })
      return res.status(200).json(admin)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const adminController = new AdminController()
export default adminController
