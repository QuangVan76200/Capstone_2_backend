const express = require('express');
const router = express.Router();
const clinicController = require('../app/controllers/ClinicController');
const auth = require('../app/middleware/auth');
const multer = require('multer');
const {
    v4: uuidv4
} = require('uuid');

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './src/public/img/clinic/');
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
router.post('/review', auth, clinicController.reviewClinic)
router.get('/:id', auth, clinicController.findById)
router.post('/', auth, upload.single('images'), clinicController.createOne)
router.get('/', auth, clinicController.showAll)

module.exports = router;