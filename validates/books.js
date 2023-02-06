const { check, validationResult } = require('express-validator');
const util 		= require('util');

const notify		= require(__path_configs + 'notify');

const option = {
    name            : {min: 3, max: 200},
    slug            : {min: 3, max: 200},
    price           : {min: 1000, max: 1000000},
    discount        : {min: 0, max: 100},
    author          : {min: 3, max: 200},
    supplier        : {min: 5, max: 200},
    publishing      : {min: 5, max: 200},
    weight          : {min: 5, max: 1000},
    page            : {min: 5, max: 5000},
    form            : {value: "novalue"},
    description     : {min: 5, max: 2000},
    ordering        : {min: 1, max: 100},
    status          : {value: "novalue"},
    category        : {value: "novalue"},
};



module.exports = 
    [	
        //NAME
        check('name', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.name.min, max: option.name.max }),

        //SLUG
        check('slug', util.format(notify.ERROR_LENGTH, option.name.min, option.name.max))
            .isLength({ min: option.slug.min, max: option.slug.max }),
        
        //PRICE
        check('price',util.format(notify.ERROR_LENGTH_INT, option.price.min, option.price.max))
            .isInt({gt: (option.price.min-1), lt: (option.price.max+1)}),
        
        //DISCOUNT
        check('discount',util.format(notify.ERROR_LENGTH_INT, option.discount.min, option.discount.max))
            .isInt({gt: (option.discount.min-1), lt: (option.discount.max+1)}),
        
        //AUTHOR
        check('author', util.format(notify.ERROR_LENGTH, option.author.min, option.author.max))
            .isLength({ min: option.author.min, max: option.name.max }),

        //SUPPLIER
        check('supplier', util.format(notify.ERROR_LENGTH, option.supplier.min, option.supplier.max))
            .isLength({ min: option.supplier.min, max: option.supplier.max }),

        //PUBLISHING
        check('publishing', util.format(notify.ERROR_LENGTH, option.publishing.min, option.publishing.max))
            .isLength({ min: option.publishing.min, max: option.publishing.max }),

        //PUBLISHINGYEAR
        // check('publisingYear', util.format(notify.ERROR_LENGTH, option.publishingYear.min, option.publishingYear.max))
        //     .isLength({ min: option.publishingYear.min, max: option.publishingYear.max }),

        //WEIGHT
        check('weight',util.format(notify.ERROR_LENGTH_INT, option.weight.min, option.weight.max))
            .isInt({gt: (option.weight.min-1), lt: (option.weight.max+1)}),

        //PAGE
        check('page',util.format(notify.ERROR_LENGTH_INT, option.page.min, option.page.max))
            .isInt({gt: (option.page.min-1), lt: (option.page.max+1)}),

        //FORM
        check('form',notify.ERROR_VALID)
            .not().equals(option.form.value),

        //DESCRIPTION
        check('description', util.format(notify.ERROR_LENGTH, option.description.min, option.description.max))
            .isLength({ min: option.description.min, max: option.description.max }),

        //ORDERING
		check('ordering',util.format(notify.ERROR_LENGTH_INT, option.ordering.min, option.ordering.max))
            .isInt({gt: (option.ordering.min-1), lt: (option.ordering.max+1)}),

        //STATUS
        check('status',notify.ERROR_VALID)
            .not().equals(option.status.value),

        //CATEGORY
        check('category',notify.ERROR_VALID)
            .not().equals(option.category.value),


    ];
