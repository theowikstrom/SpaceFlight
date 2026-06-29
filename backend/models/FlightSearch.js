const mongoose = require('mongoose');

const flightSearchSchema = new mongoose.Schema({    
    departureSpacePort: {
        type: String,
        required: [true, 'Departure airport is a compulory field'],
    },
    arrivalSpacePort: {
        type: String,
        required: [true, 'Arrival spaceport is a compulsory field.'],
    },
    liftOffDate: {
        type: Date,
        default: Date.now,
        required: [true, 'lift off date is a compulsory field.'],
    },
    returnDate: {
        type: Date,
        required: [false],
    },
    travelerCount: {
        type: Number,
        default: 1,
        required: [true, 'Amount of travelers is a compulsory field']
    }
});     

module.exports = mongoose.model('FlightSearch', flightSearchSchema);