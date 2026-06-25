import userRepository from '../repository/user.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 3 * 24 * 60 * 60 * 1000
}

class UserController {
  async register(req, res) {
    try {
      const { firstName, lastName, dni, phone, email, password, address } = req.body

      if (!firstName || !lastName || !dni || !phone || !email || !password || !address) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
      }

      const existing = await userRepository.findUserByEmail(email)
      
      if (existing) return res.status(409).json({ message: 'El email ya está registrado' })

      const passwordHash = await bcrypt.hash(password, 10)
      await userRepository.createUser({ firstName, lastName, dni, phone, email, password: passwordHash, address })

      return res.status(201).json({ message: 'Usuario creado' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' })

      const user = await userRepository.findUserByEmail(email)
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) return res.status(401).json({ message: 'Contraseña incorrecta' })

      const role = 'user'
      const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET)

      res.cookie('token', token, cookieOptions)
      return res.status(200).json({ id: user._id, role })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async dashboard(req, res) {
    try {
      const user = await userRepository.findUserById(req.auth.id)
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token', cookieOptions)
      return res.status(200).json({ message: 'Logout exitoso' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const userController = new UserController()
export default userController
