const mongoose = require('mongoose');

// Här definierar vi schemat (motsvarande tabellstrukturen)
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Du måste ange ett namn'],
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Skapa och exportera modellen utifrån schemat
module.exports = mongoose.model('Item', itemSchema);