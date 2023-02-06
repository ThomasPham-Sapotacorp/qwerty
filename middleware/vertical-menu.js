
const ClassModel 	= require(__path_models + 'classes');
const GroupModel 	= require(__path_models + 'groups');
const CateModel 	= require(__path_models + 'categories');
const BookModel 	  = require(__path_models + 'books');
const BannerModel 	= require(__path_models + 'banners');

module.exports = async (req, res, next) =>{
    let itemVertical = []
  	await ClassModel.getItemsFrontend().then((item) => {
        classes = item
	})
  	await GroupModel.getItemsFrontend().then((item) => {
        groups = item
	})
  	await CateModel.getItemsFrontend().then((item) => {
        categories = item
	})
    
    itemVertical.classes    = classes;
    itemVertical.groups     = groups;
    itemVertical.categories = categories;
    res.locals.itemVertical = itemVertical;
    next();
}