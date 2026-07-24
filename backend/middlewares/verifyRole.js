const verifyRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.auth?.role)) return res.status(403).json({ message: 'Sin permisos' })
  next()
}

export default verifyRole
