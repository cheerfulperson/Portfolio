const router = require('express').Router(),
    UserController = require('../controllers/user.controller');

/* GET users listing. */
router.post('/signup', UserController.checkAuthorize, UserController.postUser);
router.get('/verify', UserController.checkUserEmail);
router.post('/login', UserController.checkAuthorize, UserController.getAuth);
router.use('/logout', UserController.checkAuth, UserController.deleteUserSession);
router.post('/feedback', UserController.checkAuth, UserController.saveFeedback);
router.use('/avatar', UserController.checkAuth, UserController.uploadAvatar);
router.get('/auth/qrcode', UserController.checkAuth, UserController.createQRURL);
router.route('/qr/verify')
    .get(UserController.getCheckPinPage)
    .post(UserController.checkQRAuth)
router.use('/device-data', UserController.checkAuth, UserController.getNewDeviceInfo);
router.use('/chat', UserController.checkAuth, (req, res, next) => {
    res.render('layouts/chat', {title: 'Chat'});
});
module.exports = router;