const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    username    : {min: 5, max: 50},
    password    : {min: 5, max: 10},
};



module.exports = 
    [	
        //USERNAME
        check('username', util.format(notify.ERROR_LENGTH, option.username.min, option.username.max))
            .isLength({ min: option.username.min, max: option.username.max }),

        //PASSWORD
		check('password',util.format(notify.ERROR_LENGTH, option.password.min, option.password.max))
            .isLength({ min: option.password.min, max: option.password.max }),
    ]
