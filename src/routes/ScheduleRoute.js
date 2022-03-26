const express = require('express');
const router= express.Router();
const auth = require('../app/middleware/auth')
const scheduleController =require('../app/controllers/ScheduleController')


router.post('/',auth,scheduleController.updateOne);
router.get('/',auth,scheduleController.showAll);

module.exports=router;