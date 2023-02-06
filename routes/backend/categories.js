var express 	= require('express');
var router 		= express.Router();

const util 		= require('util');
const { check, validationResult } = require('express-validator');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const type 	= 'categories';
const linkIndex 	= '/' + systemConfig.prefixAdmin + '/' + type;
const folderView 	= __path_view_backend + 'pages/' + type + '/';

const CateSchema	= require(__path_schemas + type);
const CateModel 	= require(__path_models + type);
const GroupModel 	= require(__path_models + 'groups');
const BookModel 	= require(__path_models + 'books');
const CateValidate 	= require(__path_validates + type);

const FilterStatusHelper 	= require(__path_helpers + 'filter-status');
const ParamsHelper 	= require(__path_helpers + 'params');


// Hien thi
router.get('/', async(req, res, next) => {

	let params= {};	
	
	params.currentStatus 	= ParamsHelper.getParam(req.query, 'status', 'all');
	let statusFilter 		= await FilterStatusHelper.createFilterStatus(params.currentStatus, type);
	params.search 			= ParamsHelper.getParam(req.query, 'search', '');
	params.group			= ParamsHelper.getParam(req.query, 'group', '');
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
	if(params.group !== '') 			params.check['group'] = params.group
	
	params.pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page', '1')); 
	await CateModel.countItem(params.check).then((data) => {
		params.pagination.totalItems = data;
	});

	let groupItems= [];
    await GroupModel.getMenu().then((items) => {
        groupItems = items;
    });

	CateModel.listItem(params).then((items) => {
		res.render(folderView + 'index', { 
			title: 'Categories' ,
			items,
			params,
			statusFilter,
			groupItems
		});
	})
});

// Thay doi 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= ParamsHelper.getParam(req.params, 'id', '');
	let user 			= req.user;
	CateModel.changeStatus(id, user, currentStatus, {task: "update-one"}).then((result) => {
		req.flash('suscess', notify.CHANGE_STATUS_SUCCESS);
		res.redirect(linkIndex);
	})
});


// Thay doi nhieu status
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'active');
	let id 				= req.body.id;
	let user 			= req.user;
	CateModel.changeStatus(id, user, currentStatus, {task: "update-multi"}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) );
		res.redirect(linkIndex);
	});
});

// Xoa 1 phan tu
router.get('/delete/:id/', (req, res, next) => {
	let id = ParamsHelper.getParam(req.params, 'id', '');
	CateModel.deleteItem(id, {task: "delete-one"}).then((result) => {
		req.flash('success',notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Xoa nhieu phan tu
router.post('/delete/', (req, res, next) => {
	let id = req.body.id;
	CateModel.deleteItem(id, {task: "delete-multi"}).then((result) => {
		req.flash('success',util.format(notify.DELETE_MULTI_SUCCESS, result.n));
		res.redirect(linkIndex);
	});
});

// Thay doi ordering
router.post('/change-ordering/', (req, res, next) => {
	let ids			= req.body.id;
	let orderings 	= req.body.ordering;
	let user 		= req.user;
	CateModel.changeOrdering(orderings, ids, user).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	})
});

//Add
router.get(('/add(/:id)?'), async(req, res, next) => {
	let id 		= ParamsHelper.getParam(req.params, 'id', '');
	let item	= {name : '', ordering: 0, status: 'no value', group:''};
	let errors 	= [];

	let groups= [];
	await GroupModel.getMenu().then((items) => {
        groups = items;
        groups.unshift({_id: 'novalue', name: 'Choose Group'});
	});

	if(id === ''){
		res.render(folderView + 'add', { title: 'Add Page', item, errors, groups});
	}else {
		CateModel.getItem(id).then((item) => {
			res.render(folderView + 'add', { title: 'Edit Page', item, errors, groups});
		})
	}
});

//Save
router.post(('/save'), CateValidate, async (req, res, next) => {
	let item = Object.assign(req.body);
	var errors = validationResult(req).errors;
	let taskCurrent = (item.id)? "edit" : "add";
	let user = req.user;
	if(errors.length){
		let PageTitle = (taskCurrent == "add")? 'Add Page' : 'Edit Page' ;
		let groups= [];
		await GroupModel.getMenu().then((items) => {
			groups = items;
			groups.unshift({_id: 'novalue', name: 'Choose Group'});
		});
		res.render(folderView + 'add', {title: PageTitle, item, errors, groups});	

	}else {
		let message = (taskCurrent == "add")? notify.ADD_SUCCESS : notify.EDIT_SUCCESS ;
		CateModel.saveItem(item, user, {task: taskCurrent}).then((result) => {
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

//FILTER Category
router.get(('/filter-category/:category_id'), (req, res, next) => {
	req.session.category_id = ParamsHelpers.getParam(req.params, 'category_id', '');
    res.redirect(linkIndex);
});

module.exports = router;
