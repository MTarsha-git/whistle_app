const express = require('express')
const router = express.Router()
const player = require('../controllers/player-controller')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')
const upload = require('../config/multer')

// All routes protected and only accessible by authenticated users
router.use(auth)

router.post('/createPlayer', isAdmin,upload.single('photo'), player.createPlayer);

router.patch('/editPlayer/:id', isAdmin,upload.single('photo'), player.updatePlayer);

router.get('/getAllPlayersOfTeam/:TeamId', player.getAllPlayersOfTeam);

router.get('/getAllPlayers', player.getAllPlayers);

router.delete('/deletePlayer/:id', isAdmin, player.deletePlayer);

module.exports = router

//my api for player:
//http://localhost:3000/api/player/createPlayer
//http://localhost:3000/api/player/editPlayer/:id
//http://localhost:3000/api/player/getAllPlayers
//http://localhost:3000/api/player/getAllPlayersOfTeam/:TeamId
//http://localhost:3000/api/player/deletePlayer/:id