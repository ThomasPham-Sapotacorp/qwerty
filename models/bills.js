const ItemModel 	= require(__path_schemas + 'bills');
const FilesHelpers = require(__path_helpers + 'files');
const uploadFolder = 'public/upload/books/';


module.exports = {
    //
    listItem: async(params, options = null) => {
        return ItemModel
            .find(params.check)
            .sort({created: 'asc'})
            .limit(params.pagination.totalItemsPerPage)
            .skip( (params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .collation({locale: "en_US", numericOrdering: true})


    },

    allItem: async() => {
        return ItemModel
            .find({status: 'active'})
            .collation({locale: "en_US", numericOrdering: true})
    },

    randomItem: async() => {
        return ItemModel.aggregate([
            {$match:{status:'active'}},
            {$sample: {size: 2}}
        ])
    },

    itemInCategory: async(id) => {
        return ItemModel
            .find({status: 'active', category: id})
            .sort({'created.time': 'asc'})
            .populate('category')
            .populate('group')
            .populate('class');
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
    changeStatus: (id, user, currentStatus, options = null) => { 
        let status			= "";
        if (currentStatus === "pending") status = "intransit";
        if (currentStatus === "intransit") status = "completed";
        if (currentStatus === "cancel") status = "cancelled";

        let data			= {
            status: '',
            // modified: {
            //     user_id: user._id,
            //     user_name: user.name,
            //     time: Date.now()
            // }
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
    changeOrdering: async(orderings, cids, user, options = null) => { 

        let data			= {
            ordering: parseInt(orderings),
            modified: {
                user_id: user._id,
                user_name: user.name,
                time: Date.now()
            }
        };

        if( Array.isArray(cids )) {		  
            for(let i=0; i< cids.length; i++){
                data.ordering = parseInt(orderings[i]);
                await ItemModel.updateOne({_id: cids[i]}, data);
            };
            return Promise.resolve("success");
    
        } else{
            return ItemModel.updateOne({_id: cids}, data);
        }
    },

    //
    deleteItem: async (id, options = null) => { 
        if(options.task == "delete-one"){
            await ItemModel.findById(id).then((item) => {
                for (thumbnail of item.thumbnail){  
                    FilesHelpers.remove(uploadFolder, thumbnail);
                }
            });
            return	ItemModel.deleteOne({_id: id});
        }
        if(options.task == "delete-multi"){
            if(Array.isArray(id)) {
                for(let i = 0; i < id.length; i++){
                    await ItemModel.findById(id[i]).then((item) => {
                        for (thumbnail of item.thumbnail){
                            FilesHelpers.remove(uploadFolder, thumbnail);
                        }
                    });
                }
            }else {
                await ItemModel.findById(id).then((item) => {
                    for (thumbnail of item.thumbnail){
                        FilesHelpers.remove(uploadFolder, thumbnail);
                    }
                });
            }
            return 	ItemModel.remove({_id: {$in: id}});
        }
    },

    saveItem: (item) => { 
        item.created = Date.now();
        item.status = 'pending';
        return 	ItemModel(item).save();
    },

    getItembySlug: async(slug) => {
        return ItemModel
            .findOne({status:'active', slug: slug}) 
            .populate('category')
            .populate('group')
            .populate('class')
    },
    getItembyID: async(id) => {
        return ItemModel
            .findOne({status:'active', _id: id}) 

    },

    

}