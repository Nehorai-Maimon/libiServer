const express = require('express'),
router = express.Router(),
eventLogic = require('./eventLogic');

// create event
router.post('/',async (req, res)=>{
    try {
        console.log(req.body);
        const event = await eventLogic.createEvent(req.body);
        res.send(event)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

// get all events
router.get('/', async (req, res)=>{
    try {
        const events = await eventLogic.getAllEvents();
        res.send(events)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

// update event
router.post('/updateEvent', async (req, res)=>{
    try {
        res.send({server: "update success"})
    } catch (error) {
        res.status(404).send(error.message)
    }
})
module.exports = router


// מעון
// חניך  חניך חניך 
// טפסים
// תשא
// קבוצה