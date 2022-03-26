const express = require('express');
const router= express.Router();
const auth = require('../app/middleware/auth')
const messengerController = require('../app/controllers/MessengerController');

router.get('/list',auth,messengerController.showAll);
router.patch('/list/:id',auth,messengerController.changeRead);

module.exports=router;