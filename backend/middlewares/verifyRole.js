const verifyRole = (role) => (req, res, next) => {
  if (req.auth?.role !== role) return res.status(403).json({ message: 'Sin permisos' })
  next()
}

export default verifyRole
