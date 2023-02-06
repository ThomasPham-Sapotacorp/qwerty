var express 	= require('express');
var router 		= express.Router();

const util 		= require('util');
const { check, validationResult } = require('express-validator');

const systemConfig 	= require(__path_configs + 'system');
const notify		= require(__path_configs + 'notify');

const type 	= 'bills';
const linkIndex 	= '/' + systemConfig.prefixAdmin + '/' + type;
const folderView 	= __path_view_backend + 'pages/' + type + '/';

const BillModel 	= require(__path_models + type);


const FilterStatusHelper 	= require(__path_helpers + 'filter-status');
const ParamsHelper 	= require(__path_helpers + 'params');


// Hien thi
router.get('/', async(req, res, next) => {

	let params= {};	
	
	params.currentStatus 	= ParamsHelper.getParam(req.query, 'status', 'all');
	let statusFilter 		= await FilterStatusHelper.createFilterStatusCart(params.currentStatus, type);
	params.search 			= ParamsHelper.getParam(req.query, 'search', '');
	
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
	
	await BillModel.countItem(params.check).then((data) => {
		params.pagination.totalItems = data;
	});

	BillModel.listItem(params).then((items) => {
        res.render(folderView + 'index', { 
			title: 'Bills' ,
			items,
			params,
			statusFilter
		});
	})
});

// Thay doi 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelper.getParam(req.params, 'status', 'pending');
	let id 				= ParamsHelper.getParam(req.params, 'id', '');
	let user 			= req.user;
	BillModel.changeStatus(id, user, currentStatus, {task: "update-one"}).then((result) => {
		req.flash('suscess', notify.CHANGE_STATUS_SUCCESS);
		res.redirect(linkIndex);
	})
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
