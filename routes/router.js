const router = require('express').Router(),
  UserController = require('../controllers/user.controller'),
  fs = require('fs'),
  {
    join,
    extname
  } = require('path');

function getExtension(filename) {
  var ext = extname(filename || '').split('.');
  return ext[ext.length - 1];
}
/* GET home page. */
router.get('/', function (req, res, next) {
  let isThereASession ;
  let posterMedia = fs.readdirSync(join(__dirname, '../public/media/poster')).map((el, i) => {
    return {
      filePath: `/media/poster/${el}`,
      type: getExtension(el) == 'mp4' ? 'video' : 'img',
      step: i
    }
  })

  let engineersMedia = fs.readdirSync(join(__dirname, '../public/media/images/engineers')).map((el, i) => {
    return `/media/images/engineers/${el}`;
  })

  let designPhoto = () => {
    let images = fs.readdirSync(join(__dirname, '../public/media/images/design')).map((el, i) => {
      return `/media/images/design/${el}`;
    })
    return images.length == 1 ? images[0] : images[Math.round(Math.random() * (images.length - 1))];
  }

  res.render('layouts/index', {
    title: "YammyCode",
    posterMedia: posterMedia,
    engineersMedia: engineersMedia,
    designImg: designPhoto(),
    isThereASession: req.session.user ? true : false,
    reviews: [{
      classListAddShow: true
    }, 2, 3, 4, 5]
  });
});

router.get('/pricing', (req, res) => {
  res.render('layouts/pricing', {
    title: 'Pricing'
  });
})
router.get('/contacts', (req, res) => {
  res.render('layouts/contacts', {
    title: 'Contacts'
  });
})
router.get('/feedback', UserController.checkAuth, (req, res) => {
  let {
    name
  } = req.session.user
  res.render('layouts/feedback', {
    title: 'Feedback',
    name
  });
})

module.exports = router;