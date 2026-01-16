const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin-controller')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')

// Admin home page data
router.get('/home', auth, isAdmin, admin.homePageForAdmin)

module.exports = router
