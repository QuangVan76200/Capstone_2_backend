const express= require('express');
const router = express.Router();
const appointmentController = require('../app/controllers/AppointmentController');
const auth =require('../app/middleware/auth')

router.post('/request',auth,appointmentController.requestOne);
router.delete('/:id',auth,appointmentController.deleteOne);
router.patch('/:id',auth,appointmentController.acceptOne);
router.get('/',auth,appointmentController.showAll);


module.exports =router;