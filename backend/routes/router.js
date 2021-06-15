const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
    res.sendFile('./login/index.html', { root: __dirname })
})

router.get('/chat', (req, res) => {
    res.sendFile('./chat/index.html', { root: __dirname })
})

module.exports = router