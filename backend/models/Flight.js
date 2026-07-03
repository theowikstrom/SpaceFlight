const mongoose = require('mongoose');

// Här definierar vi schemat (motsvarande tabellstrukturen)
const flightSchema = new mongoose.Schema({
    flightNumeber: {
        type: Number,
        required: [true, 'Flight number is required'],
        trim: true
    },
    departureLocation: {
        type: String,
        required: [true, 'Departure location is required.'],
        trim: true
    },
    destinationLocation: {
        type: String,
        required: [true, 'Destination location is required.'],
        trim: true
    },
    departureDateAndTime: {
        type: Date,
        required: [true, 'Departure date is required.'],
    },  
    seats: [{
    seatNumber: { type: String, required: true }, 
    row: { type: Number, required: true },        
    letter: { type: String, required: true },     
    class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  }]

});

// Skapa och exportera modellen utifrån schemat
module.exports = mongoose.model('Flight', flightSchema);