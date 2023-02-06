const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    name    : {min: 5, max: 50},
    phone    : {min: 10, max: 15},
    address    : {min: 5, max: 1000},
    
};



module.exports = 
    [	
        //NAME
        check('name', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.name.min, max: option.name.max }),

        //PASSWORD
		check('address',util.format(notify.ERROR_LENGTH, option.address.min, option.address.max))
            .isLength({ min: option.address.min, max: option.address.max }),
            
        //PHONE NUMBER
        check('phone', 'Vui lòng nhập đúng số điện thoại')
        .isLength({ min: option.phone.min, max: option.phone.max }),
    ]
