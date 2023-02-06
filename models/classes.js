const ItemModel 	= require(__path_schemas + 'classes');

module.exports = {
    //
    listItem: async(params, options = null) => {
        let sort = {};
        sort[params.sortField] = params.sortType;
        // console.log(params.check);
        return ItemModel
            .find(params.check)
            .limit(params.pagination.totalItemsPerPage)
            .skip( (params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .sort(sort)			// .sort({ordering: 'asc'})
            .collation({locale: "en_US", numericOrdering: true});
    },

    //
    getItem: (id) => {
        return ItemModel.findById(id)

    },
    
    //
    countItem: (params, options = null) => {
        return ItemModel.countDocuments(params);
    },

    //
    changeStatus: (id,user, currentStatus, options = null) => { 
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data			= {
            status: '',
            modified: {
                user_id: user._id,
                user_name: user.name,
                time: Date.now()
            }
        };

        if(options.task == "update-one"){
            data.status = status;
            return ItemModel.updateOne({_id: id}, data);

        }
        if(options.task == "update-multi"){
            data.status = currentStatus;
            return ItemModel.updateMany({_id: { $in:id }}, data)

        }
    },

    //
    changeOrdering: async(orderings, ids, user, options = null) => { 

        let data			= {
            ordering: parseInt(orderings),
            modified: {
                user_id: user._id,
                user_name: user.name,
                time: Date.now(),
            }
        };

        if( Array.isArray(ids )) {		  
            for(let i=0; i< ids.length; i++){
                data.ordering = parseInt(orderings[i]);
                await ItemModel.updateOne({_id: ids[i]}, data);
            };
            return Promise.resolve("success");
    
        } else{
            return ItemModel.updateOne({_id: ids}, data);
        }
    },

    //
    deleteItem: (id, options = null) => { 
        if(options.task == "delete-one"){
            return	ItemModel.deleteOne({_id: id});
        }
        if(options.task == "delete-multi"){
            return 	ItemModel.remove({_id: {$in: id}});
        }
    },

    saveItem: (item, user, options = null) => { 
        if(options.task == "edit"){
            return ItemModel.updateOne({_id: item.id}, {
				name: item.name, 
				status: item.status,
				ordering: item.ordering,
				content: item.content,
				modified: {
					user_id: user._id,
					user_name: user.name,
					time: Date.now(),
				}
            });
        }
        if(options.task == "add"){
                item.created = {
                    user_id: user._id,
                    user_name: user.name,
                    time: Date.now()
                };
            return 	ItemModel(item).save();
        }
    },

    getMenu: (params, options = null) => { 
        return ItemModel.find({}, {_id: 1, name: 1});   
    },

    getItemsFrontend: async() => {
        return ItemModel
            .find({status:'active'}) 
            .sort({'created.time': 'asc'}) 
    },

    getItembySlug: async(slug) => {
        return ItemModel
            .findOne({status:'active', slug: slug}) 
    },
    
}