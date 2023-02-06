var express 	= require('express');
var router 		= express.Router();

const util 		= require('util');
const { check, validationResult } = require('express-validator');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const type 	= 'groups';
const linkIndex 	= '/' + systemConfig.prefixAdmin + '/' + type;
const folderView 	= __path_view_backend + 'pages/' + type + '/';

const GroupSchema	= require(__path_schemas + type);
const GroupModel 	= require(__path_models + type);
const ClassModel 	= require(__path_models + 'classes');
const GroupValidate 	= require(__path_validates + type);
const AsyncHandler  = require(__path_middleware + 'async-handle');

const FilterStatusHelper 	= require(__path_helpers + 'filter-status');
const ParamsHelper 	= require(__path_helpers + 'params');


// Hien thi
router.get('/', async(req, res, next) => {

	let params= {};	
	
	params.currentStatus 	= ParamsHelper.getParam(req.query, 'status', 'all');
	let statusFilter 		= await FilterStatusHelper.createFilterStatus(params.currentStatus, type);
	params.search 			= ParamsHelper.getParam(req.query, 'search', '');
	params.sortField 		= ParamsHelper.getParam(req.session, 'sortField', 'ordering');
	params.sortType			= ParamsHelper.getParam(req.session, 'sortType', 'asc');	
	params.pagination = {
		totalItems			: 0,
		currentPage			: 1,
		totalItemsPerPage	: 20,	
		pageRanges			: 4
	};
	

	params.check = {};
	if(params.currentStatus !== 'all') 	params.check.status = params.currentStatus;
	if(params.search !== '') 			params.check.name = new RegExp(params.search, 'i');
	
	params.pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page', '1')); 
	
	await GroupModel.countItem(params.check).then((data) => {
		params.pagination.totalItems = data;
	});


	GroupModel.listItem(params).then((items) => {
		res.render(folderView + 'index', { 
			title: 'Groups' ,
			items,
			params,
			statusFilter
		});
	})
});

// Thay doi 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= ParamsHelper.getParam(req.params, 'id', '');
	let user 			= req.user;
	GroupModel.changeStatus(id, user, currentStatus, {task: "update-one"}).then((result) => {
		req.flash('suscess', notify.CHANGE_STATUS_SUCCESS);
		res.redirect(linkIndex);
	})
});


// Thay doi nhieu status
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= req.body.id;
	let user 			= req.user;
	GroupModel.changeStatus(id, user, currentStatus, {task: "update-multi"}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) );
		res.redirect(linkIndex);
	});
});

// Xoa 1 phan tu
router.get('/delete/:id/', (req, res, next) => {
	let id = ParamsHelper.getParam(req.params, 'id', '');
	GroupModel.deleteItem(id, {task: "delete-one"}).then((result) => {
		req.flash('success',notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Xoa nhieu phan tu
router.post('/delete/', (req, res, next) => {
	let id = req.body.id;
	GroupModel.deleteItem(id, {task: "delete-multi"}).then((result) => {
		req.flash('success',util.format(notify.DELETE_MULTI_SUCCESS, result.n));
		res.redirect(linkIndex);
	});
});

// Thay doi ordering
router.post('/change-ordering/', (req, res, next) => {
	let ids			= req.body.id;
	let orderings 	= req.body.ordering;
	let user 		= req.user;

	GroupModel.changeOrdering(orderings, ids, user).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	})
});

//Add
router.get(('/add(/:id)?'), async (req, res, next) => {
	let id 		= ParamsHelper.getParam(req.params, 'id', '');
	let item	= {name : '', ordering: 0, status: 'no value', class: ''};
	let errors 	= [];
	let classes = [];
	await ClassModel.getMenu().then((items) => {
        classes = items;
        classes.unshift({_id: 'novalue', name: 'Choose Group', class: ''});
	});
	
	if(id === ''){
		res.render(folderView + 'add', { title: 'Add Page', item, errors, classes});
	}else {
		GroupModel.getItem(id).then((item) => {
			res.render(folderView + 'add', { title: 'Edit Page', item, errors, classes});
		})
	}
});

//Save
router.post('/save', GroupValidate, AsyncHandler(async (req, res, next) => {
	let item = Object.assign(req.body);
	let user 		= req.user;
	var errors = validationResult(req).errors;
	let taskCurrent = (item.id)? "edit" : "add";
	if(errors.length){
		let PageTitle = (taskCurrent == "add")? 'Add Page' : 'Edit Page' ;
		let classes= [];
		await ClassModel.getMenu().then((items) => {
			classes = items;
			classes.unshift({_id: 'novalue', name: 'Choose Group'});
		});
		res.render(folderView + 'add', {title: PageTitle, item, errors, classes});
	}else {
		let message = (taskCurrent == "add")? notify.ADD_SUCCESS : notify.EDIT_SUCCESS ;
		GroupModel.saveItem(item, user, {task: taskCurrent}).then((result) => {
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

module.exports = router;
