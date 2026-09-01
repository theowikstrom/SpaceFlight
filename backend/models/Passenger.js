const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    passportNumber: {
        type: String,
        required: [true, 'Passport number is required']
    },
    bookedFlights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    }]
}, {
    timestamps: true
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;