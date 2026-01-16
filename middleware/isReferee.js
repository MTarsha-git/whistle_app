module.exports = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 3||req.user.RoleId !== 1)
     return res.status(403).json({ message: 'Forbidden' });
  next();
};
//task: create isReferee middleware to allow only users with RoleId 3 (Referee) to access certain routes