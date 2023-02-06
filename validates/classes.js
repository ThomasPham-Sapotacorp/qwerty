const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    name            : {min: 3, max: 200},
    slug            : {min: 3, max: 200},
    ordering        : {min: 1, max: 100},
    status          : {value: "novalue"},
};



module.exports = 
    [	
        //NAME
        check('name', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.name.min, max: option.name.max }),

        //SLUG
        check('slug', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.slug.min, max: option.slug.max }),
        
        //ORDERING
		check('ordering',util.format(notify.ERROR_LENGTH_INT, option.ordering.min, option.ordering.max))
            .isInt({gt: (option.ordering.min-1), lt: (option.ordering.max+1)}),

        //STATUS
        check('status',notify.ERROR_VALID)
            .not().equals(option.status.value),

    ];
