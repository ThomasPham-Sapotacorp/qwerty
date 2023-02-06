var express = require('express');
const { itemInCategory } = require('../../../models/books');
var router = express.Router();


const layoutFrontend = __path_view_frontend + 'frontend';

const BookModel 	  	= require(__path_models + 'books');
const CateModel 	  	= require(__path_models + 'categories');
const GroupModel 	  	= require(__path_models + 'groups');
const ClassModel 	  	= require(__path_models + 'classes');

const ParamsHelper = require(__path_helpers + 'params');

let slugClass = 'bach-hoa-online'


//Class
router.get('/', async (req, res, next) => {
	let className, idClass = '';

	await ClassModel.getItembySlug(slugClass).then((item) => {
		idClass = item._id; 
		className = item.name;
	})
	
	
	res.render('frontend/pages/no-product/index', { 
    	title: className ,
    	layout: layoutFrontend,
    	header_menu: true,
  	});
});


module.exports = router;


