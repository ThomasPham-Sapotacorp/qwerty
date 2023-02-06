const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    newPw           : {min: 3, max: 50},
};



module.exports = 
    [	
        //NAME
        check('newPw', util.format(notify.ERROR_LENGTH, option.newPw.min, option.newPw.max))
            .isLength({ min: option.newPw.min, max: option.newPw.max }),

    ];
