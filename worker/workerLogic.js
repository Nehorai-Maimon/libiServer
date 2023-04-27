const workerController = require('./workerController'),
    bcrypt = require('bcrypt');

const login = async (email, phone, partnerId) => {
    const worker = await workerController.read({ email, phone })
    if (!worker) throw { status: 401, message: "worker not found" }
    const verify = await bcrypt.compare(partnerId, worker.partnerId)
    if (!verify) throw { status: 401, message: "incorrect partnerId" }
    return worker
}

const register = async (email, phone, partnerId) => {
    const worker = await workerController.read({ email, phone })
    if (worker) throw { status: 401, message: "worker already registered" }
    partnerId = await bcrypt.hash(partnerId, 10)
    return await workerController.create({ email, phone, partnerId })
}

module.exports = { login, register }