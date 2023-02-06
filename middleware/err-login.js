
module.exports = ((req, res, next) => {
    res.locals.errLogin     = req.session.errLogin ;
    res.locals.errRegister  = '';
    next();
})