module.exports = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 1)
     return res.status(403).json({ message: 'Forbidden' });
  next();
};