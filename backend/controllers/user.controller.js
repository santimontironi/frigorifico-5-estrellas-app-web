import userRepository from '../repository/user.repository.js'
import jwt from 'jsonwebtoken'
import transporter from '../config/mail.config.js'
import bcrypt from 'bcrypt'
import cookieOptions from '../config/cookie.js'

class UserController {
  async changePassword(req, res){
    try {
      const { email } = req.body

      const user = await userRepository.findByEmail(email)

      if(!user) return res.status(404).json({ message: 'Usuario no encontrado' })

      const userConfirmed = userRepository.findConfirmedUser(email)

      if(!userConfirmed){
        return res.status(404).json({ message: 'Usuario no confirmado' })
      }

      const tokenGenerated = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' })
      const resetPasswordUrl = `${process.env.FRONTEND_URL}/cambiar-clave/${tokenGenerated}`

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecer contraseña',
        html: `<p>Hacé click en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
      })

      return res.status(200).json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.' })

    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async changePasswordConfirm(req, res){
    try {
      const { token } = req.params

      let decoded
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      } catch {
        return res.status(400).json({ message: 'El enlace es inválido o ya expiró.' })
      }

      const { newPassword } = req.body

      const passwordHash = await bcrypt.hash(newPassword, 10)

      await userRepository.updatePassword(decoded.id, passwordHash)

      return res.status(200).json({ message: 'Contraseña actualizada correctamente' })
    }
    catch(error){
      return res.status(500).json({ message: error.message })
    }
  }

  async editProfile(req, res) {
    try {
      const { email, phone, address } = req.body

      const account = await userRepository.findById(req.auth.id)
      if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' })

      const emailChanged = email !== account.email

      if (emailChanged && await userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }

      const data = { phone, address }

      // Sólo si cambió el email se pisa la confirmación: el usuario tiene que
      // volver a validar la casilla nueva antes de poder iniciar sesión.
      if (emailChanged) {
        data.email = email
        data.confirmed = false
      }

      const profileEdited = await userRepository.updateUser(req.auth.id, data)

      if (emailChanged) {
        const verificationToken = jwt.sign({ id: profileEdited._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' })
        const verificationUrl = `${process.env.FRONTEND_URL}/confirmar/${verificationToken}`

        await transporter.sendMail({
          from: `"Frigorífico 5 Estrellas" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Confirmá tu nuevo email — Frigorífico 5 Estrellas',
          html: `
            <h2>Hola, ${profileEdited.firstName}.</h2>
            <p>Cambiaste el email de tu cuenta. Hacé click en el botón para confirmarlo:</p>
            <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;">Confirmar email</a>
            <p>El enlace expira en 2 horas.</p>
          `,
        })

        res.clearCookie('token', cookieOptions)
      }

      return res.status(200).json({ profileEdited, emailChanged, message: emailChanged ? 'Perfil actualizado. Revisá tu correo para confirmar tu nuevo email.' : 'Perfil actualizado correctamente'})
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'El email ya está registrado' })
      }
      return res.status(500).json({ message: error.message })
    }
  }

}

const userController = new UserController()
export default userController
