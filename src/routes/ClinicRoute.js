const express = require('express');
const router = express.Router();
const clinicController = require('../app/controllers/ClinicController');
<<<<<<< HEAD

router.use('/',clinicController.showAll);

module.exports=router;
=======
const auth = require('../app/middleware/auth');
const upload = require('../util/uploadImage')

router.post('/review', auth, clinicController.reviewClinic)
router.get('/:id', auth, clinicController.findById)
router.post('/', auth, upload.single('images'), clinicController.createOne)
router.get('/', auth, clinicController.showAll)

module.exports = router;
>>>>>>> aef33b2 (update)
