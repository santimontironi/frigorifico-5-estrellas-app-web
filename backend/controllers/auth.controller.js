class AuthController {
  me(req, res) {
    return res.status(200).json(req.auth)
  }
}

const authController = new AuthController()
export default authController
