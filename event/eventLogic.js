const eventController = require('./eventController');

const createEvent = async (eventData) => {
    if (!eventData.days || !eventData.fromDate || !eventData.untilDate ||
        !eventData.name || !eventData.type || !eventData.status)
        throw { status: 400, message: "missing details" }

    await eventController.create(eventData)
    const events = getAllEvents()
    return events
}

const getAllEvents = async () => {
    const events = await eventController.read({})
    return events
}

module.exports = { createEvent, getAllEvents }