var express = require('express');
var router = express.Router();


const layoutFrontend = __path_view_frontend + 'frontend';

const verticalMiddleware		= require(__path_middleware + 'vertical-menu');

const BookSchema 	  	= require(__path_schemas + 'books');
const BookModel 	  	= require(__path_models + 'books');
const CateModel 	  	= require(__path_models + 'categories');
const GroupModel 	  	= require(__path_models + 'groups');
const ClassModel 	  	= require(__path_models + 'classes');
const BannerModel 		= require(__path_models + 'banners');

const ParamsHelper = require(__path_helpers + 'params');

//Class
router.get('/:class', verticalMiddleware, async (req, res, next) => {
	let type = 'class'
	let itemVertical 	= res.itemVertical;
	let slugClass 		= ParamsHelper.getParam(req.params,'class','');
	let sidebar			= {items: '', type}
	
	await ClassModel.getIdbySlug(slugClass).then((id) => idClass = id)
	await BookModel.getItemsFrontend({id: idClass}, {task: 'item-class'}).then( (item) => {items = item} )
	await GroupModel.getItemsbyIdClass(idClass).then((item) => sidebar.items = item)
	
	res.render('frontend/pages/categories/index', {
    	title: 'Home' ,
    	layout: layoutFrontend,
    	header_menu: true,
		itemVertical,
		items,
		sidebar
  });
});


module.exports = router;

