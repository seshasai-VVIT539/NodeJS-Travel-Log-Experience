const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/users', (req, res) => {
    res.status(201).send('hi')
})

module.exports = router