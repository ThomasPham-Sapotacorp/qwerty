var express = require('express');
var router = express.Router();

var passport = require('passport');

const sessions = require('express-session');
const { check, validationResult } = require('express-validator');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const UserModel 	= require(__path_models + 'users');

const linkIndex 	= '/' + systemConfig.prefixFrontend ;

const middleGetUserInfo         = require(__path_middleware + 'get-user-info');


router.get('/', async(req, res, next) => {
	res.redirect(linkAdmin)
});

router.post('/', async(req, res, next) => {
	let item = Object.assign(req.body);
	let count = 0;
	await UserModel.checkUser(item.username).then((item) => {count = item})
	if(count){
		req.flash('error', notify.ERROR_REGISTER);
		res.redirect(linkIndex)
	}else{
		UserModel.saveItem(item, {task: 'register'}).then((result) => {
			req.flash('success',notify.REGISTER);
			res.redirect(linkIndex);
		});
	}
	
});


module.exports = router;
