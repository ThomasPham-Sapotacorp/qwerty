const { check } = require("express-validator");

const ItemModel 	= require(__path_schemas + 'books');
const FilesHelpers = require(__path_helpers + 'files');
const uploadFolder = 'public/upload/books/';


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
            .collation({locale: "en_US", numericOrdering: true})
            .populate('category')
            .populate('group')
            .populate('class')

    },

    allItem: async() => {
        return ItemModel
            .find({status: 'active'})
            .collation({locale: "en_US", numericOrdering: true})
    },

    randomItem: async() => {
        return ItemModel
        .aggregate([
            {$match:{status:'active'}},
            {$sample: {size: 2}},
            { "$lookup": {
                "from": "books",
                "localField": "category",
                "foreignField": "category",
                "as": "books"
            }},
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

    saveItem: (item, user, options = null) => { 
        if(options.task == "edit"){
            return ItemModel.updateOne({_id: item.id}, {
				name: item.name, 
                slug: item.slug,
				status: item.status,
				ordering: item.ordering,
				content: item.content,
                category: item.category,
                group: item.groupID,
                class: item.classID,
                thumbnail: item.thumbnail,
                price: item.price,
                discount: item.discount,
                author: item.author,
                supplier: item.supplier,
                publishing: item.publishing,
                publishingYear: item.publishingYear,
                weight: item.weight,
                page: item.page,
                form: item.form,
                description: item.description,
                modified: {
                    user_id: user._id,
                    user_name: user.name,
                    time: Date.now()
                }
            });
        }
        if(options.task == "add"){
            item.group = item.groupID
            item.class = item.classID
            item.created = {
                user_id: user._id,
                user_name: user.name,
                time: Date.now()
            };
            return 	ItemModel(item).save();
        }
    },

    getItemsFrontend: async(params=null, options = []) => {

        let find= {};  
        let sort = {ordering: 'asc'};

        if(options.task == 'item-class'){
            find = {status:'active', class: params.id, price: {$gte: params.price.gte, $lte: (params.price.lte > 0)?params.price.lte:99999999} };
            sort = {ordering: 'asc'};
        }

        if(options.task == 'item-group'){
            find = {status:'active', group: params.id, price: {$gte: params.price.gte, $lte: (params.price.lte > 0)?params.price.lte:99999999}};
            sort = {ordering: 'asc'};
        }

        if(options.task == 'item-category'){
            find = {status:'active', category: params.id, price: {$gte: params.price.gte, $lte: (params.price.lte > 0)?params.price.lte:99999999}};
            sort = {ordering: 'asc'};
        }

        if(options.task == 'result'){
            find = {status:'active', 
                    price: {$gte: params.check.gte, $lte: (params.check.lte > 0)?params.check.lte:99999999},
                    name : params.check.search };
            sort = {ordering: 'asc'};
        }

        return ItemModel
            .find(find) 
            .sort(sort) 
            .populate('category')
            .populate('group')
            .populate('class')
            
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