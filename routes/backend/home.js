var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('backend/pages/home/index', { title: 'Dashboard' });
});

module.exports = router;
