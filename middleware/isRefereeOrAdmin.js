module.exports = (req, res, next) => {
  if (!req.user || (req.user.RoleId !== 3 && req.user.RoleId !== 1))
     return res.status(403).json({ message: 'Forbidden' });
  next();
};
// This middleware checks if the user is a referee (RoleId === 3) or
//  admin (RoleId === 1). If not, it returns a 403 Forbidden response.
//  If the user is either, it calls next() to proceed to the next middleware or route handler.