const ObjectId = require('mongoose').Types.ObjectId

const validateId = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send({ message: "Please send proper ID" })
    } else {
        next()
    }
}

module.exports = validateId