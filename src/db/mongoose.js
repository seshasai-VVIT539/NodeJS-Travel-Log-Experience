const mongoose = require('mongoose')

const uri = process.env.MONGODB_URL

mongoose.connect(uri, {
    useNewUrlParser: true
})