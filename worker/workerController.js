const workerModel = require("./workerModel")

const create = async (workerData) => {
    return await workerModel.create(workerData)
}
const read = async (filter, prog) => {
    return await workerModel.findOne(filter, prog)
}
const update = async (filter, data) => {
    return await workerModel.updateOne(filter, data)
}

module.exports = { create, read, update }