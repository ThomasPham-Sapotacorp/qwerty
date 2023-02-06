const type = 'users'
const ItemModel 	= require(__path_schemas + type);
const FilesHelpers = require(__path_helpers + 'files');
const uploadFolder = 'public/upload/' + type;
var md5 = require('md5');
const { Mongoose } = require('mongoose');

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
        return ItemModel.aggregate([
            {$match:{status:'active'}},
            {$sample: {size: 2}}
        ])
    },

    itemInCategory: async(id) => {
        return ItemModel
            .find({status: 'active', category: id})
            .sort({'created.time': 'asc'});
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
    changeStatus: (id, currentStatus, options = null) => { 
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data			= {
            status: '',
            modified: {
                user_id: 0,
                user_name: 'admin',
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
    changeOrdering: async(orderings, cids, options = null) => { 

        let data			= {
            ordering: parseInt(orderings),
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
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
                FilesHelpers.remove(uploadFolder, item.avatar);
            });
            return	ItemModel.deleteOne({_id: id});
        }
        if(options.task == "delete-multi"){
            if(Array.isArray(id)) {
                for(let i = 0; i < id.length; i++){
                    await ItemModel.findById(id[i]).then((item) => {
                        FilesHelpers.remove(uploadFolder, item.avatar);
                    });
                }
            }else {
                await ItemModel.findById(id).then((item) => {
                    FilesHelpers.remove(uploadFolder, item.avatar);
                });
            }
            return 	ItemModel.remove({_id: {$in: id}});
        }
    },

    saveItem: (item, options = null) => { 
        if(options.task == "edit"){
            return ItemModel.updateOne({_id: item.id}, {
				name: item.name, 
                username: item.username,
				password: md5(item.password),
				phone: item.phone,
				address: item.address,
                avatar: item.avatar,
                admin: item.admin
            });
        }
        if(options.task == "add"){
            item.password =  md5(item.password),    
            item.created = Date.now()
            return 	ItemModel(item).save();
        }
        if(options.task == "register"){
            item.password =  md5(item.password),    
            item.created = Date.now(),
            item.admin = 'customer'
            return 	ItemModel(item).save();
        }
    },

    getItemsFrontend: async(params=null, options = []) => {
        let find= {};  
        let sort = {ordering: 'asc'};

        if(options.task == 'item-class'){
            find = {status:'active', class: params.id};
            sort = {ordering: 'asc'};
        }

        if(options.task == 'item-group'){
            find = {status:'active', group: params.id};
            sort = {ordering: 'asc'};
        }

        if(options.task == 'item-category'){
            find = {status:'active', category: params.id};
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

    getItembyUsername: async(username) => {
        return ItemModel
            .findOne({username: username}) 
    },

    checkUser: async(username) => {
        return ItemModel
            .count({username: username}) 
    },

    saveCart: (user, cart) => {    
        return ItemModel.update(
            { _id: user.id}, 
            {$push: {cart: cart}}
        );   
    },

    daleteCart: (user) => {    
        return ItemModel.update(
            { _id: user.id}, 
            { $unset: { cart: [] } }
        );   
    },

    updateCart: (user, item) => {
        return ItemModel.update(
            { _id: user.id, "cart.id":cart.id}, 
            { $set: { 
                "cart.$.qty" : item.qty + cart.qty,
                "cart.$.totalprice": item.totalprice + cart.totalprice,
            }}
        );
    },
    

    changeQty: (user, cart, qty) => {
        return ItemModel.update(
            { _id: user.id, "cart.id":cart.id}, 
            { $set: { 
                "cart.$.qty" : qty,
                "cart.$.totalprice": cart.price * qty,
            }}
        );
    },

    deleteItemInCart: (user, id) => {
        return ItemModel.update({ _id: user.id }, 
            { "$pull": { "cart": { "id": id } }}, { safe: true, multi:true }); 
    },

    updatePw: (user, pw) => {
        return ItemModel.updateOne({ _id: user.id}, 
            { password: md5(pw)}
        );
    },


}