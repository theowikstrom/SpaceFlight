const mongoose = require('mongoose');

const spacePortSchema = new mongoose.Schema({
    planetName: {
        type: String,
        required: [true, 'Planet is required'],
        trim: true
    },
    spaceportName: {
        type: String,
        trim: true,
        required: [true, 'Spaceport name is required']   
    },
    cityName: {
        type: String,
        trim: true,
        required: [true, 'City name is required'] 
    },
    ISTA: {
        type: String,
        trim: true,
        required: [true, 'ISTA-code is required']
    }
});

module.exports = mongoose.model('SpacePort', spacePortSchema);