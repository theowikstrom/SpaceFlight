const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Importera modellen

// GET: Hämta alla items (Async/Await används istället för synkron kod)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Skapa ett nytt item
router.post('/', async (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;