const router = require('express').Router(),
    UserController = require('../controllers/user.controller');

/* GET users listing. */
router.post('/signup', UserController.postUser);
router.get('/verify', UserController.checkUserEmail);
router.post('/login', UserController.getAuth);
router.use('/logout', UserController.checkAuth, UserController.deleteUserSession);
router.post('/feedback', UserController.checkAuth, UserController.saveFeedback);
router.use('/avatar', UserController.checkAuth, UserController.uploadAvatar);
router.get('/auth/qrcode', UserController.checkAuth, UserController.createQRURL);
router.route('/qr/verify')
.get((req, res) => {
    res.render('layouts/pin', {title: 'pin'})
})
.post( UserController.checkQRAuth)

module.exports = router;