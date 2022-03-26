const express =require('express');
const router= express.Router();
const doctorController = require('../app/controllers//DoctorController');
const auth = require('../app/middleware//auth')


router.get('/list-doctor',auth,doctorController.showAll);
router.get('/list-doctor/:id',auth,doctorController.showOne);
router.post('/review',auth,doctorController.reviewDoctor);
router.get('/:id',auth,doctorController.findOne);



module.exports=router;