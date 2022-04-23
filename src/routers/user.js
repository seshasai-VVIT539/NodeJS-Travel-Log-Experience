const express = require('express')

const router = express.Router()

router.get('/users', (req, res) => {
    res.status(201).send('hi')
})

module.exports = router