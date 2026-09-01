const mongoose = require('mongoose');

// Här definierar vi schemat (motsvarande tabellstrukturen)
const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: [true, 'Flight number is required'],
        trim: true
    },
    departureSpacePort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpacePort',
    required: [true, 'Departure spaceport is required.'],
    },
    destinationSpaceport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpacePort',
    required: [true, 'Destination spaceport is required.'],
    },
    departureDateAndTime: {
        type: Date,
        required: [true, 'Departure date is required.'],
    },
    arrivalDateAndTime: {
        type: Date,
        required: [true, 'Arrival date and time is required.']
    },  
    seats: [{
    seatNumber: { type: String, required: true }, 
    row: { type: Number, required: true },        
    letter: { type: String, required: true },     
    class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
    price: {type: mongoose.Schema.Types.Decimal128},
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', default: null }
  }]

});

// Skapa och exportera modellen utifrån schemat
module.exports = mongoose.model('Flight', flightSchema);