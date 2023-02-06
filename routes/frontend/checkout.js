var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

const layoutFrontend 	= __path_view_frontend + 'frontend';
const folderView 		= __path_view_frontend + 'pages/checkout/index';

const CheckoutValidate 	= require(__path_validates + 'checkout');
const notify			= require(__path_configs + 'notify');
const UserModel 	  	= require(__path_models + 'users');
const BillModel	  		= require(__path_models + 'bills');


router.get('/', async (req, res, next) => {
	let items = req.cookies.cart;
	if(req.isAuthenticated()){
		await UserModel.getItem(req.user.id).then(item => items = item.cart)
	}

	let errors = "";

	let total = 0;

	if(items) items.forEach((item) => {
		total += item.totalprice;
	})

	res.render(folderView, { 
    	title: 'Check Out' ,
    	layout: layoutFrontend,
    	header_menu: true,
		items,
		errors,
		total
  	});
});

router.post('/', CheckoutValidate, async (req, res, next) => {
	let items = req.cookies.cart;


	if(req.isAuthenticated()){
		await UserModel.getItem(req.user.id).then(item => items = item.cart)
	}

	let total = 0;
	items.forEach((item) => {
		total += item.totalprice;
	})

	let bill 	= {};
	bill.name 	= req.body.name;
	bill.phone 	= req.body.phone;
	bill.address = req.body.address;
	bill.note 	= req.body.note;
	bill.total 	= req.body.total; // + ship
	bill.cart 	= items;
	if(req.user) bill.user = req.user._id;

	var errors = validationResult(req).errors;

	if(errors.length){
		res.render(folderView, { 
			title: 'Check Out' ,
			layout: layoutFrontend,
			header_menu: true,
			items,
			errors,
			total
	  });

	}else {
		if(req.isAuthenticated()){
			await UserModel.daleteCart(req.user)
		}
		await BillModel.saveItem(bill).then((result) => {
			res.cookie('cart', []);
			req.flash('success',notify.ADD_BILL);
			res.redirect('/');
		})
	}

});

router.get('/delete/:id', async (req, res, next) => {
	let id = req.params.id;
	
	let cart = req.cookies.cart;

	cart = cart.filter(function(item) { return item.id != id });

	if(cart){
		res.cookie('cart', cart, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})
	}

	if(req.isAuthenticated()){
		await UserModel.getItem(req.user.id).then(item => cart = item.cart)
		await UserModel.deleteItemInCart(req.user, id)
	}

	res.redirect("/checkout")

});


module.exports = router;

