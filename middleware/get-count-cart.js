const UserModel 	  	= require(__path_models + 'users');

module.exports = async (req, res, next) =>{
    let count = 0;
    if(req.cookies.cart) count = req.cookies.cart.length;
    
    if(req.isAuthenticated()){
        await UserModel.getItem(req.user.id).then(item => count = item.cart.length)
    }
    res.locals.countCart = count;
    next();
}