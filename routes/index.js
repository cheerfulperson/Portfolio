let router = require('express').Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('layouts/index', { reviews: [{classListAddShow:true},2,3,4,5] });
});

module.exports = router;
