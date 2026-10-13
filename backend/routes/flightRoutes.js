const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const flightController = require('../controllers/flightController');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    return next();
};

const flightSearchQueryValidation = [
    query('origin').isString().trim().notEmpty().isLength({ max: 100 }),
    query('destination').optional({ values: 'falsy' }).isString().trim().isLength({ max: 100 }),
    query('outboundDate')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .isISO8601({ strict: true, strictSeparator: true }),
    query('returnDate')
        .optional({ values: 'falsy' })
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .isISO8601({ strict: true, strictSeparator: true })
        .bail()
        .custom((returnDate, { req }) => (
            typeof req.query.outboundDate === 'string' &&
            typeof req.query.destination === 'string' &&
            returnDate >= req.query.outboundDate
        ))
        .withMessage('Return date requires a destination and cannot be before the outbound date.'),
    query('adultCount').isInt({ min: 1, max: 10 }),
    query('childCount').optional({ values: 'falsy' }).isInt({ min: 0, max: 10 }),
    query('travelClass').optional({ values: 'falsy' }).isIn(['Economy', 'Business', 'First']),
    validateRequest
];

const bookingValidation = [
    query('flightNumber').isInt({ min: 1 }),
    validateRequest
];

router.get('/search', flightSearchQueryValidation, flightController.searchFlights);
router.get('/book', bookingValidation, flightController.initBooking);

module.exports = router;
