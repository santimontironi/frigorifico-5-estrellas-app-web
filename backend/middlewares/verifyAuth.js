import jwt from 'jsonwebtoken'

const verifyAuth = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'No autenticado' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.auth = payload  // { id, role: 'user' | 'admin' }
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}

export default verifyAuth
