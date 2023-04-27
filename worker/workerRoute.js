const express = require('express'),
    router = express.Router(),
    auth = require('../auth')
workerLogic = require('./workerLogic');

router.post('/login', async (req, res) => {
    try {
        const email = req.body.userName
        const phone = req.body.identifaier
        const partnerId = req.body.password
        const worker = await workerLogic.login(email, phone, partnerId)
        const token = auth.createToken(worker)
        res.send([worker, token])
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/register', async (req, res) => {
    try {
        const email = req.body.userName
        const phone = req.body.identifaier
        const partnerId = req.body.password
        const worker = await workerLogic.register(email, phone, partnerId)
        const token = auth.createToken(worker)
        res.send([worker, token])
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router