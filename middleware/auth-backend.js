
const systemConfig = require(__path_configs + 'system');
const linkIndex =  '/' + systemConfig.prefixFrontend 

module.exports = ((req, res, next) => {

    if(req.isAuthenticated() && req.user.admin == 'admin'){
        next();     
    }else{
        res.redirect('back');
    }

})