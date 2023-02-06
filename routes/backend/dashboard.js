var express = require('express');
var router = express.Router();

const BillsModel 	= require(__path_models + 'bills');
const FilterStatusHelper 	= require(__path_helpers + 'filter-status');


/* GET users listing. */
router.get('/', async function(req, res, next) {

  let billFilter 		= await FilterStatusHelper.createFilterStatusCart('', 'bills');
 
  res.render('backend/pages/dashboard/index', { 
    title: 'Dashboard2',
    billFilter
   });
});

router.get('/add', function(req, res, next) {
  res.render('backend/pages/dashboard/add', { title: 'Dashboard' });
});
module.exports = router;
