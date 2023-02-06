var express = require('express');
const { itemInCategory } = require('../../../models/books');
var router = express.Router();


const layoutFrontend = __path_view_frontend + 'frontend';

const BookModel 	  	= require(__path_models + 'books');
const CateModel 	  	= require(__path_models + 'categories');
const GroupModel 	  	= require(__path_models + 'groups');
const ClassModel 	  	= require(__path_models + 'classes');

const ParamsHelper = require(__path_helpers + 'params');

let slugClass = 'sach-tieng-viet'


//Class
router.get('/', async (req, res, next) => {
	
	let type 		= 'class';
	let sidebar		= {items: '', type};
	let items 		= [];
	let className, idClass = '';
	let price		= {};

	price.gte = ParamsHelper.getParam(req.query, 'price_gte', '0');
	price.lte = ParamsHelper.getParam(req.query, 'price_lte', 0);

	await ClassModel.getItembySlug(slugClass).then((item) => {
		idClass = item._id; 
		className = item.name;
	})

	await BookModel.getItemsFrontend({id: idClass, price}, {task: 'item-class'}).then( (item) => {items = item} )
	await GroupModel.getItemsbyIdClass(idClass).then((item) => sidebar.items = item)
	
	if(items.length){
		res.render('frontend/pages/categories/index', { 
			title: className ,
			layout: layoutFrontend,
			header_menu: true,
			items,
			sidebar,
		  });
	}else{
		res.render('frontend/pages/no-product/index', { 
			title: className ,
			layout: layoutFrontend,
			header_menu: true,
		});
	}
	
});


//Group
router.get('/:group', async (req, res, next) => {
	let type = 'group'
	let slugGroup		= ParamsHelper.getParam(req.params,'group','');
	let sidebar			= {items: '', type}
	let groupName = '';

	let price		= {};

	price.gte = ParamsHelper.getParam(req.query, 'price_gte', 0);
	price.lte = ParamsHelper.getParam(req.query, 'price_lte', 0);


	await GroupModel.getItembySlug(slugGroup).then((item) => {
		idGroup = item.id;
		groupName = item.name;
	})	

	await BookModel.getItemsFrontend({id: idGroup, price}, {task: 'item-group'}).then( (item) => {items = item} )
	
	await CateModel.getItemsbyIdGroup(idGroup).then((item) => sidebar.items = item)

	if(items.length){
		res.render('frontend/pages/categories/index', { 
			title: groupName ,
			layout: layoutFrontend,
			header_menu: true,
			items,
			sidebar,
	  	});
	}else{
		res.render('frontend/pages/no-product/index', { 
			title: 'Không có sản phẩm' ,
			layout: layoutFrontend,
			header_menu: true,
		});
	}
	
	
});

//Category
router.get('/:group/:category', async (req, res, next) => {
	let type = 'category'
	let slugCate		= ParamsHelper.getParam(req.params,'category','');
	let slugGroup		= ParamsHelper.getParam(req.params,'group','');
	let sidebar			= {items: '', type}
	let cateName = '';

	let price		= {};

	price.gte = ParamsHelper.getParam(req.query, 'price_gte', 0);
	price.lte = ParamsHelper.getParam(req.query, 'price_lte', 0);

	await ClassModel.getItembySlug(slugClass).then((item) => idClass = item._id)
	await GroupModel.getItembySlug(slugGroup, idClass).then((item) => idGroup = item.id )
	await CateModel.getItembySlug(slugCate).then((item) => {
		idCate = item.id;
		cateName = item.name;
	})

	await BookModel.getItemsFrontend({id: idCate, price}, {task: 'item-category'}).then( (item) => {items = item} )
	await CateModel.getItemsbyIdGroup(idGroup).then((item) => sidebar.items = item)
	
	res.render('frontend/pages/categories/index', { 
    	title: cateName ,
    	layout: layoutFrontend,
    	header_menu: true,
		items,
		sidebar
  });
});


module.exports = router;


