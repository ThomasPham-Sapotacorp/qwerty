const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    name            : {min: 3, max: 200},
    username        : {min: 3, max: 50},
    password        : {min: 1, max: 50},
    phone           : {min: 10, max: 15},
    address         : {min: 1, max: 200},
    admin           : {value: "novalue"},

};



module.exports = 
    [	
        //NAME
        check('name', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.name.min, max: option.name.max }),

        //USERNAME
        check('username', util.format(notify.ERROR_LENGTH, option.username.min, option.username.max))
            .isLength({ min: option.username.min, max: option.username.max }),
        
        //PASSWORD
        check('password', util.format(notify.ERROR_LENGTH, option.password.min, option.password.max))
        .isLength({ min: option.password.min, max: option.password.max }),

        //PHONE NUMBER
        check('phone', util.format(notify.ERROR_LENGTH, option.phone.min, option.phone.max))
        .isLength({ min: option.phone.min, max: option.phone.max }),

        //ADDRESS
        check('address', util.format(notify.ERROR_LENGTH, option.address.min, option.address.max))
        .isLength({ min: option.address.min, max: option.address.max }),

        //ADMIN
        check('status',notify.ERROR_VALID)
        .not().equals(option.admin.value),

    ];
