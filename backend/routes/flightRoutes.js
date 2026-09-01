const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');


const flightController = require('../controllers/flightController');

/**
 * Validation
 */
const flightSearchQueryValidation = [
    query(['origin', 'destination', 'outboundDate', 'returnDate', 'adultCount', 'childCount', 'travelClass']).isString().isLength({ max: 100 }).escape(),
    query('outboundDate').isISO8601(),
    query('returnDate').optional({ values: 'falsy' }),
    query(['adultCount', 'childCount']).isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false, 
                errors: errors.array()
            });
        }
        next();
    }
];

router.get('/search', flightSearchQueryValidation, flightController.searchFlights);

router.get('/book', flightController.initBooking);



module.exports = router;