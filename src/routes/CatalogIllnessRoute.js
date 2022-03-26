const express = require('express');
const router = express.Router();
const catalogInessController = require('../app/controllers/CatalogIllnessController');

router.use('/',catalogInessController.showAll);


module.exports = router;