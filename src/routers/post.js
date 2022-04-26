const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Post = require('../models/post')

const router = express.Router()

router.post('/posts/me', auth, async (req, res) => {
    const uid = req.user._id
    const post = new Post({ ...req.body, by: uid })
    try {
        await post.save()
        res.send(post)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find()
        if (posts.length == 0) {
            res.status(204).send()
        } else {
            res.send(posts)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/posts/me', auth, async (req, res) => {
    const uid = req.user._id
    try {
        const posts = await Post.find({ by: new mongoose.Types.ObjectId(uid) })
        if (posts.length != 0) {
            res.send(posts)
        } else {
            res.status(204).send()
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/posts/me/:postId', auth, async (req, res) => {
    const uid = req.user._id
    const postId = req.params.postId
    try {
        const post = await Post.findOne({
            _id: new mongoose.Types.ObjectId(postId),
            by: new mongoose.Types.ObjectId(uid)
        })
        if (post) {
            res.send(post)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/posts/me/:postId', auth, async (req, res) => {
    const uid = req.user._id
    const postId = req.params.postId
    const updates = Object.keys(req.body)
    const allowedUpdates = ['location', 'experience', 'tripRating']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const post = await Post.findOne({
            _id: new mongoose.Types.ObjectId(postId),
            by: new mongoose.Types.ObjectId(uid)
        })
        if (post) {
            updates.forEach((update) => post[update] = req.body[update])
            await post.save()
            res.send(post)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": e.message })
    }
})

router.delete('/posts/me/:postId', auth, async (req, res) => {
    const uid = req.user._id
    const postId = req.params.postId
    try {
        const post = await Post.findOne({
            _id: new mongoose.Types.ObjectId(postId),
            by: new mongoose.Types.ObjectId(uid)
        })
        if (post) {
            await post.remove()
            res.send(post)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router