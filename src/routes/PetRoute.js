const express = require('express');
const router = express.Router();
const PetController = require('../app/controllers/PetController');
const auth = require('../app/middleware/auth');
const multer = require('multer')
const {
    v4: uuidv4
} = require('uuid');

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './src/public/img/pet/');
    },
    filename: function (request, file, callback) {

        callback(null, '' + uuidv4() + file.originalname.split(file.originalname.length - 1));
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
router.get('/list-pet', auth, PetController.showByOwnerId);
router.get('/list-pet/:id', auth, PetController.showByPetId);
router.delete('/:id', auth, PetController.deletePet)
router.post('/', auth, upload.array('images', 5), PetController.addPet);

module.exports = router;