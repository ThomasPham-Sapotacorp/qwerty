var express 	= require('express');
var router 		= express.Router();

const util 		= require('util');
const { check, validationResult } = require('express-validator');
const multer = require("multer");
var randomstring = require("randomstring");
const path 		 = require('path');

const BookModel 	= require(__path_models + 'books');
const CateModel 	= require(__path_models + 'categories');
const BookValidate 	= require(__path_validates + 'books');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const FilterStatusHelper 	= require(__path_helpers + 'filter-status');
const ParamsHelper 			= require(__path_helpers + 'params');
const FilesHelper 			= require(__path_helpers + 'files');
const UploadMiddleware		= require(__path_middleware + 'uploadBook');
const AsyncHandler  = require(__path_middleware + 'async-handle');

const type 	= 'books';
const linkIndex 	= '/' + systemConfig.prefixAdmin + '/' + type;
const folderView 	= __path_view_backend + 'pages/books/';
const folderUpload 	= __path_upload + type;

// Hien thi
router.get('/', AsyncHandler(async(req, res, next) => {

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
	
	await BookModel.countItem(params.check).then((data) => {
		params.pagination.totalItems = data;
	});

	let cateItems= [];
	await CateModel.getMenu().then((items) => {
		cateItems = items;
		cateItems.unshift({_id: 'novalue', name: 'Choose Category'});
	});

	BookModel.listItem(params).then((items) => {
		res.render(folderView + 'index', { 
			title: 'Books' ,
			items,
			params,
			statusFilter,
			cateItems
		});
	})
}));

// Thay doi 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= ParamsHelper.getParam(req.params, 'id', '');
	let user			= req.user;	
	BookModel.changeStatus(id, user, currentStatus, {task: "update-one"}).then((result) => {
		req.flash('suscess', notify.CHANGE_STATUS_SUCCESS);
		res.redirect(linkIndex);
	})
});


// Thay doi nhieu status
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 	= req.body.id;
	let user = req.user;
	BookModel.changeStatus(id, user, currentStatus, {task: "update-multi"}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) );
		res.redirect(linkIndex);
	});
});

// Xoa 1 phan tu
router.get('/delete/:id/', (req, res, next) => {
	let id = ParamsHelper.getParam(req.params, 'id', '');
	BookModel.deleteItem(id, {task: "delete-one"}).then((result) => {
		req.flash('success',notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Xoa nhieu phan tu
router.post('/delete/', (req, res, next) => {
	let id = req.body.id;
	BookModel.deleteItem(id, {task: "delete-multi"}).then((result) => {
		req.flash('success',util.format(notify.DELETE_MULTI_SUCCESS, result.n));
		res.redirect(linkIndex);
	});
});

// Thay doi ordering
router.post('/change-ordering/', (req, res, next) => {
	let ids			= req.body.id;
	let orderings 	= req.body.ordering;
	let user		= req.user;
	BookModel.changeOrdering(orderings, ids, user).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	})
});

//Add
router.get(('/add(/:id)?'), async (req, res, next) => {
	let id 		= ParamsHelper.getParam(req.params, 'id', '');
	let item	= {name : '', ordering: 0, status: 'no value', category:''};
	let errors 	= [];

	let MenuCategories= [];
	await CateModel.getMenu().then((items) => {
        MenuCategories = items;
        MenuCategories.unshift({_id: 'novalue', name: 'Choose Category', group: ''});
	});

	if(id === ''){
		res.render(folderView + 'add', { title: 'Add Page', item, errors, MenuCategories});
	}else {
		BookModel.getItem(id).then((item) => {
			res.render(folderView + 'add', { title: 'Edit Page', item, errors, MenuCategories});
		})
	}
});

//Save
router.post(('/save'), UploadMiddleware,  BookValidate, AsyncHandler( async (req, res, next) => {
	let item = Object.assign(req.body);
	let user = req.user;
	var errors = validationResult(req).errors;
	let taskCurrent = (item.id)? "edit" : "add";
	item.thumbnail	= [];
	
	let errorUpload	= req.res.errorUpload;
	if(errorUpload) {
		errors.push({param: 'thumbnail', msg: errorUpload});
	}	

	
	if(errors.length){
		let PageTitle = (taskCurrent == "add")? 'Add Page' : 'Edit Page' ;
		if(req.files) { //xoa img da up khi gap loi
			for (const thumbnail of req.files) {	
				FilesHelper.remove(folderUpload, thumbnail.filename);
			}
		}
		
		let MenuCategories= [];
		await CateModel.getMenu().then((items) => {
			MenuCategories = items;
			MenuCategories.unshift({_id: 'novalue', name: 'Choose Category'});
		});
		res.render(folderView + 'add', {title: PageTitle, item, errors, MenuCategories});

	}else {
		let message = (taskCurrent == "add")? notify.ADD_SUCCESS : notify.EDIT_SUCCESS  ;
		
		if(req.files.length){
			for (const thumbnail of req.files) {	
				await item.thumbnail.push(thumbnail.filename) ;
			}
			if (Array.isArray(item.imageOld)){
				for (imageOld of item.imageOld){
					FilesHelper.remove(folderUpload, imageOld);
				}
			}else{
				FilesHelper.remove(folderUpload, item.imageOld);
			}
		}else{
			if (Array.isArray(item.imageOld)){			
				for (imageOld of item.imageOld){
					item.thumbnail.push(imageOld)
				}
			} else {
				item.thumbnail.push(item.imageOld)
			}	
		}
		
		BookModel.saveItem(item, user, {task: taskCurrent}).then((result) => {
			req.flash('success',message);
			res.redirect(linkIndex);
		});
	}
}));

//Sort
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	let sortField		= ParamsHelper.getParam(req.params, 'sort_field', 'ordering');
	let sortType		= ParamsHelper.getParam(req.params, 'sort_type', 'asc');
	req.session.sortType = sortType;
	req.session.sortField = sortField;
	res.redirect(linkIndex);
});

//Upload Test
router.get('/upload', (req, res, next) => {
	let errors = null
	res.render(`${folderView}/upload`, { title: 'Upload', errors });
});

router.post('/upload', UploadMiddleware, (req, res, next) => {
    let errors 	= [];
	let err		= req.socket._httpMessage.errorUpload;
	if (err) {
		errors.push({param: 'books', msg: err});	
	}
	res.render(`${folderView}/upload`, { title: 'Upload', errors});	
})


module.exports = router;
