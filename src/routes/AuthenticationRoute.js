const express = require('express');
const router= express.Router();
const authenticationController = require('../app/controllers/AuthenticationController');
const authPhone = require('../app/middleware/authPhone');

router.post('/login',authenticationController.login);
router.post('/register',authenticationController.register);
router.post('/check',authenticationController.checkExists);
router.post('/',authPhone,authenticationController.checkToken);

module.exports=router;
