import userRepository from '../repository/user.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/mail.config.js'

class UserController {
  async register(req, res) {
    try {
      const { firstName, lastName, dni, phone, email, password, address } = req.body

      if (!firstName || !lastName || !dni || !phone || !email || !password || !address) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
      }

      const { street, number, city, province } = address
      if (!street || !number || !city || !province) {
        return res.status(400).json({ message: 'La dirección está incompleta' })
      }

      if (await userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const user = await userRepository.create({ firstName, lastName, dni, phone, email, password: passwordHash, address, role: 'user' })

      const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })
      const verificationUrl = `${process.env.FRONTEND_URL}/verificar/${verificationToken}`

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

  async confirmUser(req, res) {
    try {
      const { token } = req.params

      let decoded
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
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
}

const userController = new UserController()
export default userController
