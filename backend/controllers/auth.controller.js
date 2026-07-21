import userRepository from '../repository/user.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieOptions from '../config/cookie.js'
import transporter from '../config/mail.config.js'

class AuthController {
  async register(req, res) {
    try {
      const { firstName, lastName, dni, phone, email, password, address } = req.body

      const { street, number, city, province } = address
      if (!street || !number || !city || !province) {
        return res.status(400).json({ message: 'La dirección está incompleta' })
      }

      const userInactive = await userRepository.findUserInactiveByDni(dni)

      const userInactiveByMail = await userRepository.findUserInactiveByEmail(email)

      if (userInactive || userInactiveByMail) return res.status(401).json({ message: 'Fuiste dado de baja. Contacta con el frigorífico' })

      if (await userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const user = await userRepository.create({ firstName, lastName, dni, phone, email, password: passwordHash, address, role: 'user' })

      const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' })
      const verificationUrl = `${process.env.FRONTEND_URL}/confirmar/${verificationToken}`

      await transporter.sendMail({
        from: `"Frigorífico 5 Estrellas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirmá tu cuenta — Frigorífico 5 Estrellas',
        html: `
          <h2>Hola, ${firstName}.</h2>
          <p>Gracias por registrarte. Hacé click en el botón para confirmar tu cuenta:</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;">Confirmar cuenta</a>
          <p>El enlace expira en 2 horas.</p>
        `,
      })

      return res.status(201).json({ message: 'Usuario creado. Revisá tu correo para confirmar la cuenta.' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async registerAdmin(req, res) {
    try {
      const { email, password } = req.body

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

  async registerEmployee(req, res) {
    try {
      const { email, password } = req.body

      if (await userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      await userRepository.create({ email, password: passwordHash, role: 'employee', confirmed: true })

      return res.status(201).json({ message: 'Empleado creado' })
    }
    catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
      }

      const account = await userRepository.findByEmail(email)

      if (!account) return res.status(401).json({ message: 'Credenciales inválidas' })

      if (!account.active) return res.status(401).json({ message: 'Fuiste dado de baja, contacta con el frigorífico' })

      const passwordMatch = await bcrypt.compare(password, account.password)
      if (!passwordMatch) return res.status(401).json({ message: 'Credenciales inválidas' })

      if (account.role === 'user' && !account.confirmed) {
        return res.status(403).json({ message: 'Cuenta no confirmada. Revisá tu correo.' })
      }

      const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

      res.cookie('token', token, cookieOptions)
      return res.status(200).json({ id: account._id, role: account.role })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async confirmUser(req, res) {
    try {
      const { token } = req.params

      let decoded
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      } catch {
        return res.status(400).json({ message: 'El enlace es inválido o ya expiró.' })
      }

      const user = await userRepository.findById(decoded.id)
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

      if (user.confirmed) return res.status(200).json({ message: 'La cuenta ya estaba confirmada.' })

      await userRepository.confirmUser(decoded.id)

      return res.status(200).json({ message: 'Cuenta confirmada. Ya podés iniciar sesión.' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
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

  me(req, res) {
    return res.status(200).json(req.auth)
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
