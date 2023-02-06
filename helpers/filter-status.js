
let createFilterStatus = async (currentStatus, type) => {
	const currentModel = require(__path_schemas + type);

    let statusFilter = [
		{name: 'all', count: 1, link: '#', class: ''},
		{name: 'active', count: 1, link: '#', class: ''},
		{name: 'inactive', count: 1, link: '#', class: ''},
	]

	for(let i = 0; i < statusFilter.length; i++){
		let checkStatus = {};
		let item = statusFilter[i];
		if(item.name === currentStatus)  statusFilter[i].class = 'active';
        if(item.name !== 'all')  		 checkStatus = {status: item.name};
		await currentModel.countDocuments(checkStatus).then((data) => {
			statusFilter[i].count = data;
		})
	}
    return statusFilter;
};

let createFilterStatusCart = async (currentStatus, type) => {
	const currentModel = require(__path_schemas + type);

    let statusFilter = [
		{name: 'all', value: 'all', count: 1, link: '#', class: ''},
		{name: 'pending', value: 'pending', count: 1, link: '#', class: ''},
		{name: 'in transit', value: 'intransit', count: 1, link: '#', class: ''},
		{name: 'completed', value: 'completed', count: 1, link: '#', class: ''},
		{name: 'cancelled', value: 'cancelled', count: 1, link: '#', class: ''},
	]

	for(let i = 0; i < statusFilter.length; i++){
		let checkStatus = {};
		let item = statusFilter[i];
		if(item.value === currentStatus)  statusFilter[i].class = 'active';
        if(item.value !== 'all')  		 checkStatus = {status: item.value};
		await currentModel.countDocuments(checkStatus).then((data) => {
			statusFilter[i].count = data;
		})
	}
    return statusFilter;
}

module.exports = {
    createFilterStatus,
	createFilterStatusCart
}