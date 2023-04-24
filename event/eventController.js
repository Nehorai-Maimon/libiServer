const eventModel = require("./eventModel");

const create = async (eventData) => {
    const event = await eventModel.create(eventData);
    return event
}
const read = async (filter) => {
    const event = await eventModel.find(filter)
    return event
}
const update = async (eventData) => { 
    const event = await eventModel.updateOne(filter,eventData)
    return event
}

module.exports = {create, read, update}