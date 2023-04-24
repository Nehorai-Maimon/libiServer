require("dotenv").config()
jwt = require("jsonwebtoken"),
    SECRET = process.env.SECRET

const createToken = (user) => {
    const currentUser = user
    const token = jwt.sign({ user: currentUser._id }, SECRET, { expiresIn: "1h" })
    return token
}

const verifyToken = (req, res, next) => {
    const token = req.headers.token.split(" ")[1]
    const decode = jwt.verify(token, SECRET)
    req.userId = decode.user
    next()
}

module.exports = { createToken, verifyToken }