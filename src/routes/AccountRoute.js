const express = require('express');
const router= express.Router();
const accountController = require('../app/controllers/AccountController');
const auth =require('../app/middleware/auth');
const multer =require('multer')
const {v4:uuidv4} = require('uuid');


const storage = multer.diskStorage({
    destination:function(request,file,callback){
        callback(null,'./src/public/img/doctor/');
    },  
    filename: function(request,file,callback){
          callback(null,'' +uuidv4()+file.originalname.split(file.originalname.length-1));
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const upload =multer({storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
      },
    fileFilter: fileFilter
})

router.post('/register',accountController.register);
router.post('/login',accountController.login);
router.post('/registerByAccount',auth,accountController.registerByAccount);
router.post('/information',auth,upload.single('image'),accountController.createInformation);
router.get('/:id',auth,accountController.getOne);
router.get('/',auth,accountController.checkToken);


module.exports =router;