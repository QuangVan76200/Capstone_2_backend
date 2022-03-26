const express = require('express');
const router= express.Router();
const accountController = require('../app/controllers/AccountController');
<<<<<<< HEAD
const auth =require('../app/middleware/auth');

router.post('/register',accountController.register);
router.post('/login',accountController.login);
router.get('/',auth,accountController.checkToken);


module.exports =router;
=======
const auth = require('../app/middleware/auth');
const upload = require('../util/uploadImage');
router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/registerByAccount', auth, accountController.registerByAccount);
router.post('/information', auth, upload.single('image'), accountController.createInformation);
router.get('/:id', auth, accountController.getOne);
router.get('/', auth, accountController.checkToken);


module.exports = router;
>>>>>>> aef33b2 (update)
