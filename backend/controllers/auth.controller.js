class AuthController {
  me(req, res) {
    return res.status(200).json({ auth: req.auth })
  }
}

const authController = new AuthController()
export default authController
