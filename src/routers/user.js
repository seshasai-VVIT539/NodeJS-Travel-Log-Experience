const express = require('express')
const validateId = require('../middleware/validId')
const User = require('../models/user')

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({
            user: user,
            message: 'Welcome ' + user.name
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/:id', validateId, async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) {
            throw new Error('User not found')
        }
        res.send(user)
    } catch (e) {
        res.status(400).send({ message: e.message })
    }
})

router.patch('/users/:id', validateId, async (req, res) => {
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete('/users/:id', validateId, async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (user) {
            await user.remove()
            res.send(user)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router