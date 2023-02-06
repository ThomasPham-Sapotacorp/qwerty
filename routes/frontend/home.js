var express = require('express');
const { itemInCategory } = require('../../models/books');
var router = express.Router();


const layoutFrontend = __path_view_frontend + 'frontend';

const BookModel 	  	= require(__path_models + 'books');
const CateModel 	  	= require(__path_models + 'categories');
const GroupModel 	  	= require(__path_models + 'groups');
const ClassModel 	  	= require(__path_models + 'classes');
const BannerModel 		= require(__path_models + 'banners');

const ParamsHelper = require(__path_helpers + 'params');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  	let itemBanner, books = [];

  	await BannerModel.showBanner().then((item) => {
    	itemBanner = item
  	})
	await BookModel.getItemsFrontend().then((item) => {
    	books = item
  	})  
	//console.log(req.sessionID)

  	res.render('frontend/pages/home/index', { 
    	title: 'Home' ,
    	layout: layoutFrontend,
    	header_menu: false,
		itemBanner,
		books,
  });
});


router.get('/result', async (req, res, next) => {

	let items 	= [];
	let check 	= {};

	let search = ParamsHelper.getParam(req.query, 'search', ' ');
	if(search !== '')	check.search = new RegExp(search, 'i');

	check.gte = ParamsHelper.getParam(req.query, 'price_gte', '0');
	check.lte = ParamsHelper.getParam(req.query, 'price_lte', 0);

	await BookModel.getItemsFrontend({check}, {task: 'result'}).then((item) => {
		items = item
  	})  

	
	if(items.length){
		res.render('frontend/pages/result/index', { 
			title: 'Tìm kiếm theo: ' + search ,
			layout: layoutFrontend,
			header_menu: true,
			items,
			search
		  });
	}else{
		res.render('frontend/pages/no-product/index', { 
			title: 'Không có sản phẩm: ' + search ,
			layout: layoutFrontend,
			header_menu: true,
		});
	}
});





//Book
router.get('/:book', async (req, res, next) => {
	let type = 'book'
	let slugBook		= ParamsHelper.getParam(req.params,'book','');
	let item = {}

	await BookModel.getItembySlug(slugBook).then((items) => item = items)
	
	if(item){
		await BookModel.randomItem().then((items) => randomItem = items)
		await BookModel.itemInCategory(item.category).then((items) => itemCategory = items)
		res.render('frontend/pages/books/index', { 
			title: item.name ,
			layout: layoutFrontend,
			header_menu: true,
			item,
			randomItem,
			itemCategory
	  	});
	}else{
		res.render('frontend/pages/no-product/index', { 
			title: 'Không có sản phẩm' ,
			layout: layoutFrontend,
			header_menu: true,
		  });
	}
	
});

module.exports = router;


