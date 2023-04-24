const workerController = require('./workerController');

const login = async (email, phone, partnerId) => {
    const worker = await workerController.read({ email, phone, partnerId })
    if (!worker) throw { status: 401, message: "worker not found" }
    return worker
}

module.exports = { login }