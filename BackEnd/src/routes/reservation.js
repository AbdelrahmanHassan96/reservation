const express = require('express')
const reservations = require('../controllers/reservation')
const auth = require('../middleware/author')
const router = new express.Router()

//add reservation
router.post('/reservation/add',auth, reservations.add )
//get week schedle
router.get('/reservation/getWeekSchedle',reservations.getWeekSchedle)
//delete reservation by id
router.delete('/reservation/cancel/:id',auth,reservations.delete)
//get user reservation
router.get('/reservation/show',auth,reservations.showReservation)


module.exports = router