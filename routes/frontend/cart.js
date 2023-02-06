var express = require('express');
var router = express.Router();


const layoutFrontend 	= __path_view_frontend + 'frontend';
const folderView 		= __path_view_frontend + 'pages/cart/';

const notify		= require(__path_configs + 'notify');
const ParamsHelper 			= require(__path_helpers + 'params');
const BookModel 	  	= require(__path_models + 'books');
const UserModel 	  	= require(__path_models + 'users');
const UserSchema	  	= require(__path_schemas + 'users');


router.get('/', async (req, res, next) => {
	let items = req.cookies.cart;
	
	if(req.isAuthenticated()){
		await UserModel.getItem(req.user.id).then(item => items = item.cart)
	}

	let total = 0;
	items.forEach((item) => {
		total += item.totalprice;
	})
	
	res.render(folderView, { 
    	title: 'Cart' ,
    	layout: layoutFrontend,
    	header_menu: true,
		items,
		total
  });
});


router.post('/add-to-cart', async (req, res, next) => {
	let item = {name: '', price: 0, totalprice: 0, thumbnail: '' }

	item.qty 		= parseInt(ParamsHelper.getParam(req.body, 'qty', 0));
	item.id 		= ParamsHelper.getParam(req.body, 'id', '');

	await BookModel.getItembyID(item.id).then((result)=> {
		item.name 		= result.name;
		item.price		= result.price;
		item.thumbnail 	= result.thumbnail[0];
	})
	item.totalprice 	= item.qty * item.price;

	let cart = req.cookies.cart;

	function check(cart, item){
		let foo = false;
		cart.forEach(cart => {
			if(cart.id == item.id){
				foo = true;
			}
		})
		return foo;	
	}

	if(cart){
		if(check(cart, item)){
			cart.forEach(itemCart => {
				if(itemCart.id === item.id){
					itemCart.qty 	+= item.qty;
					itemCart.totalprice  = itemCart.qty * itemCart.price;
					req.cookies.cart.maxAge = 2 * 60 * 60 * 1000;
				}
			})
		}else{
			cart.push(item);
		}
		
		res.cookie('cart', cart, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})
	}else{
		res.cookie('cart', [item], { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})
	}

	


	if(req.isAuthenticated()){
		if(check(req.user.cart, item)){
			req.user.cart.forEach(async itemCart => {
				await UserModel.updateCart(req.user, itemCart, item)
			})
		}else{
			await UserModel.saveCart(req.user, item)
		}
	}

	
	req.flash('success',notify.ADD_CART);
	res.redirect('back');
});

router.post('/buy-now', async (req, res, next) => {
	let item = {name: '', price: 0, totalprice: 0, thumbnail: '' }

	item.qty 		= parseInt(ParamsHelper.getParam(req.body, 'qty', 0));
	item.id 			= ParamsHelper.getParam(req.body, 'id', '');

	await BookModel.getItembyID(item.id).then((result)=> {
		item.name 		= result.name;
		item.price		= result.price;
		item.thumbnail 	= result.thumbnail[0];
	})
	item.totalprice 	= item.qty * item.price;

	let cart = req.cookies.cart;

	function check(cart, item){
		let foo = false;
		cart.forEach(cart => {
			if(cart.id == item.id){
				foo = true;
			}
		})
		return foo;
		
	}

	

	if(cart){
		if(check(cart, item)){
			cart.forEach(itemCart => {
				if(itemCart.id === item.id){
					itemCart.qty 	+= item.qty;
					itemCart.totalprice  = itemCart.qty * itemCart.price;
					req.cookies.cart.maxAge = 2 * 60 * 60 * 1000;
				}
			})
		}else{
			cart.push(item);
		}
		
		res.cookie('cart', cart, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})
	}else{
		res.cookie('cart', [item], { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})
	}

	


	if(req.isAuthenticated()){
		if(check(req.user.cart, item)){
			req.user.cart.forEach(async itemCart => {
				await UserModel.updateCart(req.user, itemCart, item)
			})
		}else{
			await UserModel.saveCart(req.user, item)
		}
	}

	res.redirect('/cart');
});



router.get('/delete-item/:id', async (req, res, next) => {
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

	res.redirect("/cart")
});


router.post('/checkout', async (req, res, next) => {
	let qty = req.body.qty;

	let cart = req.cookies.cart;

	for(let i = 0; i< cart.length; i++){
		cart[i].qty = qty[i];
		cart[i].totalprice = cart[i].qty * cart[i].price;

		if(req.isAuthenticated()){
			await UserModel.changeQty(req.user, req.user.cart[i], qty[i])
		}

	}

	res.cookie('cart', cart, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true})

	

	res.redirect("/checkout")
	
});

module.exports = router;

