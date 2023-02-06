var express = require('express');
var router = express.Router();

const AuthMiddleware = require(__path_middleware + 'auth-backend');
const UserInfoMiddleware = require(__path_middleware + 'get-user-info');

router.use('/', AuthMiddleware, UserInfoMiddleware, require('./home'));
router.use('/books', require('./books'));
router.use('/categories', require('./categories'));
router.use('/groups', require('./groups'));
router.use('/classes', require('./classes'));
router.use('/banners', require('./banners'));
router.use('/users', require('./users'));
router.use('/bills', require('./bills'));
router.use('/dashboard', require('./dashboard'));


module.exports = router;
