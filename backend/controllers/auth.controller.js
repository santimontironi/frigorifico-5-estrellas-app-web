import cookieOptions from '../config/cookie.js'

class AuthController {
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
