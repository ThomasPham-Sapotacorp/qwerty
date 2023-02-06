var express = require('express');
var router = express.Router();

var passport = require('passport');

const sessions = require('express-session');
const { check, validationResult } = require('express-validator');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const LoginValidate = require(__path_validates + 'login');

const linkAdmin 	= '/' + systemConfig.prefixAdmin ;
const linkIndex 	= '/' + systemConfig.prefixFrontend ;

router.get('/', async(req, res, next) => {
	res.locals.errLogin = 'hello'
	res.redirect('back')
});

router.get('/logout', async(req, res, next) => {
	req.logout();
	res.redirect(linkIndex);
});

router.post('/', LoginValidate, async(req, res, next) => {
	let item = Object.assign(req.body);
	var errors = validationResult(req).errors;
	if(errors.length){
		req.flash('error', notify.ERROR_LOGIN);
		res.redirect('/login')
	}else {
		passport.authenticate('local', {
			successRedirect: linkAdmin + '/dashboard',
			failureRedirect: '/login',
			failureFlash   : true
		})(req, res, next)
	}
});


module.exports = router;
