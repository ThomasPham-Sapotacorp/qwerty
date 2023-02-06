var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
var md5 = require('md5');

const layoutFrontend 	= __path_view_frontend + 'frontend';
const folderView 		= __path_view_frontend + 'pages/user/';

const notify		= require(__path_configs + 'notify');
const ParamsHelper 			= require(__path_helpers + 'params');
const UserModel 	  	= require(__path_models + 'users');
const BillModel	  		= require(__path_models + 'bills');

const PasswordValidate 	= require(__path_validates + 'password');

router.get('/', async (req, res, next) => {
	let user = req.user;
	let cartInfo = {};

	await BillModel.countItem({status: 'pending', user: user.id}).then((item) => cartInfo.pending = item)
	await BillModel.countItem({status: 'intransit', user: user.id}).then((item) => cartInfo.intransit = item)
	await BillModel.countItem({status: 'completed', user: user.id}).then((item) => cartInfo.completed = item)
	await BillModel.countItem({status: 'cancelled', user: user.id}).then((item) => cartInfo.cancelled = item)

	let errors, fct = '';
	res.render(folderView, { 
    	title: 'User Infomation' ,
    	layout: layoutFrontend,
    	header_menu: true,
		cartInfo,
		errors,
		fct

  });
});

router.post('/change-password', PasswordValidate, async (req, res, next) => {
	let user = req.user;
	var errors = validationResult(req).errors;

	let curPw 		= req.body.curPw;
	let newPw 		= req.body.newPw;

	await UserModel.getItem(user.id).then((item) => {
		if(item.password !== md5(curPw)) errors.push({param: 'curPw', msg: notify.ERROR_PASSWORD});
	})

	if(errors.length > 0){
		let cartInfo = {};
		await BillModel.countItem({status: 'pending', user: user.id}).then((item) => cartInfo.pending = item)
		await BillModel.countItem({status: 'intransit', user: user.id}).then((item) => cartInfo.intransit = item)
		await BillModel.countItem({status: 'completed', user: user.id}).then((item) => cartInfo.completed = item)
		await BillModel.countItem({status: 'cancelled', user: user.id}).then((item) => cartInfo.cancelled = item)
		let fct = "modal.style.display = 'block'"		
		res.render(folderView, { 
			title: 'User Infomation' ,
			layout: layoutFrontend,
			header_menu: true,
			cartInfo,
			errors,
			fct
	  	});
		
	}else{
		req.flash('success',notify.CHANGE_PASSWORD_SUCCESS);
		await UserModel.updatePw(user, newPw)
		res.redirect('back');
	}
	
});


module.exports = router;

