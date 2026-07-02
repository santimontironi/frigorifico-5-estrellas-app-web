import userRepository from '../repository/user.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieOptions from '../config/cookie.js'

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
      }

      const account = await userRepository.findByEmail(email)
      if (!account) return res.status(401).json({ message: 'Credenciales inválidas' })

      const passwordMatch = await bcrypt.compare(password, account.password)
      if (!passwordMatch) return res.status(401).json({ message: 'Credenciales inválidas' })

      if (account.role === 'user' && !account.confirmed) {
        return res.status(403).json({ message: 'Cuenta no confirmada. Revisá tu correo.' })
      }

      const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, { expiresIn: '3d' })

      res.cookie('token', token, cookieOptions)
      return res.status(200).json({ id: account._id, role: account.role })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  me(req, res) {
    return res.status(200).json(req.auth)
  }

  async profile(req, res) {
    try {
      const account = await userRepository.findById(req.auth.id)
      if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' })
      return res.status(200).json(account)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  logout(req, res) {
    try {
      res.clearCookie('token', cookieOptions)
      return res.status(200).json({ message: 'Logout exitoso' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const authController = new AuthController()
export default authController
