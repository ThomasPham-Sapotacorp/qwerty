var express 	= require('express');
var router 		= express.Router();

const util 		= require('util');
const { check, validationResult } = require('express-validator');
const multer = require("multer");
var randomstring = require("randomstring");
const path 		 = require('path');

const UserModel 	= require(__path_models + 'users');
const UserValidate 	= require(__path_validates + 'users');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const FilterStatusHelper 	= require(__path_helpers + 'filter-status');
const ParamsHelper 			= require(__path_helpers + 'params');
const FilesHelper 			= require(__path_helpers + 'files');
const UploadMiddleware		= require(__path_middleware + 'uploadAvatar');

const type 	= 'users';
const linkIndex 	= '/' + systemConfig.prefixAdmin + '/' + type;
const folderView 	= __path_view_backend + 'pages/' + type + '/';
const folderUpload 	= __path_upload + type;

// Hien thi
router.get('/', async(req, res, next) => {

	let params= {};	
	
	params.currentStatus 	= ParamsHelper.getParam(req.query, 'status', 'all');
	let statusFilter 		= await FilterStatusHelper.createFilterStatus(params.currentStatus, type);
	params.search 			= ParamsHelper.getParam(req.query, 'search', '');
	params.category			= ParamsHelper.getParam(req.query, 'category', '');
	params.sortField 		= ParamsHelper.getParam(req.session, 'sortField', 'ordering');
	params.sortType			= ParamsHelper.getParam(req.session, 'sortType', 'asc');	
	params.pagination = {
		totalItems			: 0,
		currentPage			: 1,
		totalItemsPerPage	: 5,	
		pageRanges			: 4
	};
	

	params.check = {};
	if(params.currentStatus !== 'all') 	params.check.status = params.currentStatus;
	if(params.search !== '') 			params.check.name = new RegExp(params.search, 'i');
	if(params.category !== '') 			params.check['category.id'] = params.category
	
	params.pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page', '1')); 
	
	await UserModel.countItem(params.check).then((data) => {
		params.pagination.totalItems = data;
	});


	UserModel.listItem(params).then((items) => {
		res.render(folderView + 'index', { 
			title: 'List Users' ,
			items,
			params,
			statusFilter,
		});
	})
});

// Thay doi 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= ParamsHelper.getParam(req.params, 'id', '');
	
	UserModel.changeStatus(id, currentStatus, {task: "update-one"}).then((result) => {
		req.flash('suscess', notify.CHANGE_STATUS_SUCCESS);
		res.redirect(linkIndex);
	})
});


// Thay doi nhieu status
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 	= req.body.id;

	UserModel.changeStatus(id, currentStatus, {task: "update-multi"}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) );
		res.redirect(linkIndex);
	});
});

// Xoa 1 phan tu
router.get('/delete/:id/', (req, res, next) => {
	let id = ParamsHelper.getParam(req.params, 'id', '');
	UserModel.deleteItem(id, {task: "delete-one"}).then((result) => {
		req.flash('success',notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Xoa nhieu phan tu
router.post('/delete/', (req, res, next) => {
	let id = req.body.id;
	UserModel.deleteItem(id, {task: "delete-multi"}).then((result) => {
		req.flash('success',util.format(notify.DELETE_MULTI_SUCCESS, result.n));
		res.redirect(linkIndex);
	});
});

// Thay doi ordering
router.post('/change-ordering/', (req, res, next) => {
	let ids			= req.body.id;
	let orderings 	= req.body.ordering;

	UserModel.changeOrdering(orderings, ids).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	})
});

//Add
router.get(('/add(/:id)?'), async (req, res, next) => {
	let id 		= ParamsHelper.getParam(req.params, 'id', '');
	let item	= {name : ''};
	let errors 	= [];

	if(id === ''){
		res.render(folderView + 'add', { title: 'Add Page', item, errors});
	}else {
		UserModel.getItem(id).then((item) => {
			res.render(folderView + 'add', { title: 'Edit Page', item, errors});
		})
	}
});

//Save
router.post(('/save'), UploadMiddleware,  UserValidate, async (req, res, next) => {
	let item = Object.assign(req.body);
	var errors = validationResult(req).errors;
	let taskCurrent = (item.id)? "edit" : "add";
	item.avatar	= [];

	let errorUpload	= req.res.errorUpload;
	if(errorUpload) {
		errors.push({param: 'avatar', msg: errorUpload});
	}	
	if(errors.length){
		let PageTitle = (taskCurrent == "add")? 'Add Page' : 'Edit Page' ;
		if(req.file) FilesHelper.remove(folderUpload, req.file.filename);
		item.avatar = item.imageOld;
		res.render(folderView + 'add', {title: PageTitle, item, errors});

	}else {
		let message = (taskCurrent == "add")? notify.ADD_SUCCESS : notify.EDIT_SUCCESS  ;
		if(req.file){
			item.avatar = req.file.filename;
			if(taskCurrent == "edit") FilesHelper.remove(folderUpload, item.imageOld);
		}else{
			item.avatar = item.imageOld;
		}
		
		UserModel.saveItem(item, {task: taskCurrent}).then((result) => {
			req.flash('success',message);
			res.redirect(linkIndex);
		});
	}
});

//Sort
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	let sortField		= ParamsHelper.getParam(req.params, 'sort_field', 'ordering');
	let sortType		= ParamsHelper.getParam(req.params, 'sort_type', 'asc');
	req.session.sortType = sortType;
	req.session.sortField = sortField;
	res.redirect(linkIndex);
});


module.exports = router;
