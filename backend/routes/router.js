const express = require('express')
const router = express.Router()

const Actions = require('../actions/Actions')

router.post('/sign-in', Actions.signIn)
router.get('/login', Actions.login)

router.get('/chat', Actions.chat)
router.post('/chat', Actions.sendMessage)

module.exports = router