const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    by: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        trim: true,
        required: true
    },
    tripRating: {
        type: Number,
        validate(value) {
            if (value <= 0 || value > 5) {
                throw new Error('Please provide valid rating (1-5)')
            }
        }
    }
}, {
    timestamps: true
})

const uri = process.env.MONGODB_URL
mongoose.connect(uri, {
    useNewUrlParser: true
})

postSchema.methods.toJSON = function () {
    const post = this
    const publicUser = post.toObject()
    return publicUser
}

const Post = mongoose.model('Post', postSchema)

module.exports = Post