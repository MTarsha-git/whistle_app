const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //check if user already has a valid token
    const existingToken = await db.Token.findOne({ where: { UserId: user.id } });
    if (existingToken) {
      const now = new Date();
        if (existingToken.expiryDate > now) {
            return res.status(200).json({ message: "Logged in successfully",data:{token:existingToken.token}});
        }
    }
    //if no valid token delete existing token
    if (existingToken) {
      await existingToken.destroy();
    }
    // Create JWT token upon successful login
    const secret = process.env.JWT_SECRET || 'dev_whistle_secret_change_me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { id: user.id, RoleId: user.RoleId },
      secret,
      { expiresIn }
    );
    //store token in database
    await db.Token.create({
      token,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      UserId: user.id,  
    });
    res.status(200).json({ message: "Logged in successfully",data:{token}});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
// Get current logged-in user:its used to fetch the user info based on the token 
//for example in the frontend to display user profile
 const me = async (req, res) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: 'Authentication required' });
      const user = await db.User.findByPk(req.user.id, {
        attributes: ['id', 'userName', 'email', 'photo', 'RoleId', 'RefereeId']
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'Current user', data: user });
    } catch (err) {
      console.error('Error fetching current user:', err);
      return res.status(500).json({ message: 'Error fetching current user' });
    }
  };
  

  //what is i can add more functions here later:1-logout,2-change password,3-reset password 

  module.exports = {
    login,
    me,
  };