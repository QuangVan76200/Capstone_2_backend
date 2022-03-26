const express = require('express');
const router = express.Router();
const illnessController = require('../app/controllers/IllnessController');

router.use('/',illnessController.showAll);

module.exports=router;