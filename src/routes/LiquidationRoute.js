const express = require('express');
const router = express.Router();
const appointmentController = require('../app/controllers/AppointmentController');
const liquidationController = require('../app/controllers/LiquidationController')
const auth = require('../app/middleware/auth')
const upload = require('../util/uploadImage')

// router.post('/request', auth, appointmentController.requestOne);
// router.delete('/:id', auth, appointmentController.deleteOne);
// router.patch('/:id', auth, appointmentController.acceptOne);

router.get('/all', auth, liquidationController.requestAll);
router.get('/allById', auth, liquidationController.requestAllById);
router.post('/post', auth, upload.array('imageProduct', 5), liquidationController.postProduct);
router.delete('/:id', auth, liquidationController.deleteProduct);
router.put('/:id', auth, liquidationController.putProduct);

router.get('/:id', auth, liquidationController.requestOne);
router.put('/:id', auth, liquidationController.putProduct);



module.exports = router;