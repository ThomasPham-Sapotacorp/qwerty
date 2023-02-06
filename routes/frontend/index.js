var express = require('express');
var router = express.Router();

const AuthFrontendMiddleware = require(__path_middleware + 'auth-frontend');

router.use('/sach-tieng-viet', require('./category/stv'));  

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/checkout', require('./checkout'));
router.use('/cart', require('./cart'));
router.use('/user',AuthFrontendMiddleware, require('./user'));

router.use('/vpp-do-dung-hoc-sinh', require('./category/vpp'));
router.use('/foreign-books', require('./category/frbook'));
router.use('/do-choi', require('./category/dc'));
router.use('/lam-dep-suc-khoe', require('./category/ldsk'));
router.use('/hanh-trang-den-truong', require('./category/htdt'));
router.use('/bach-hoa-online', require('./category/bhonl'));
router.use('/do-choi-theo-thuong-hieu', require('./category/dctth'));

router.use('/', require('./home'));


module.exports = router;
