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
    // Create JWT token upon successful login
    const secret = process.env.JWT_SECRET || 'dev_whistle_secret_change_me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { id: user.id, RoleId: user.RoleId },
      secret,
      { expiresIn }
    );

    res.status(200).json({ message: "Logged in successfully",
        data:{
            name: user.userName,
            token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};

 const me = async (req, res) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
      const user = await db.User.findByPk(req.user.id, {
        attributes: ['id', 'userName', 'email', 'phoneNumber', 'birthDate', 'address', 'photo', 'RoleId', 'RefereeId']
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'Current user', data: user });
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching current user' });
    }
  }

  module.exports = {
    login,
    me,
  };