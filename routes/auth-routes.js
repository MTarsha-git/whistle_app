const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth-controller')
const auth = require('../middleware/auth-maddleware')

router.post('/login', authController.login)

// Protected route: requires Bearer token
router.get('/me', auth, authController.me)

module.exports = router

/*
my api endpoints:
http://localhost:3000/api/auth/login -->POST  send {email,password} in body
http://localhost:3000/api/auth/me  -->GET requires Bearer token in Authorization header
*/