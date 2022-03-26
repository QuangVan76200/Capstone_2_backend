const express = require('express');
const router = express.Router();
const OwnerController = require('../app/controllers/OwnerController');
const auth = require('../app/middleware/auth');
const upload = require('../util/uploadImage')

router.post('/upload_image_profile', auth, upload.single('profile'), OwnerController.updateProfile);
router.get('/list-pet-owner', auth, OwnerController.showAll)

module.exports = router;