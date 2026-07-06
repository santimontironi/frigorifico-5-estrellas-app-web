import userRepository from '../repository/user.repository.js'
import jwt from 'jsonwebtoken'
import transporter from '../config/mail.config.js'
import bcrypt from 'bcrypt'

class UserController {
  async changePassword(req, res){
    try {
      const { email } = req.body

      const user = await userRepository.findByEmail(email)

      if(!user) return res.status(404).json({ message: 'Usuario no encontrado' })

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

      if(!newPassword) return res.status(400).json({ message: 'La nueva contraseña es obligatoria' })

      const passwordHash = await bcrypt.hash(newPassword, 10)

      await userRepository.updatePassword(decoded.id, passwordHash)

      return res.status(200).json({ message: 'Contraseña actualizada correctamente' })
    }
    catch(error){
      return res.status(500).json({ message: error.message })
    }
  }
  
}

const userController = new UserController()
export default userController
