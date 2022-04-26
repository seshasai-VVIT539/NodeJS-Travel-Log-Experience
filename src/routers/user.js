const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user: user,
            accessToken: token,
            message: 'Welcome ' + user.name
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ accessToken: token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const user = req.user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const user = req.user
    try {
        await user.remove()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router