require('dotenv').config(); // Laddar in variabler från .env
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const itemRoutes = require('./routes/itemRoutes');
const flightRouter = require('./routes/flightRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

const mockEmployees = [
        {id: 1, name: "Theo"},
        {id: 2, name: "Beo"}
    ]



// View Engine 
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');
// Middleware
app.use(require('cors')());

app.use(express.json()); 

app.use(express.static(path.join(__dirname, '../frontend')));
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Ansluten till MongoDB framgångsrikt!'))
    .catch((err) => console.error('Kunde inte ansluta till MongoDB:', err));

// API-Routes
app.use('/api/items', itemRoutes);

app.use('/flights', flightRouter);


app.get('/api/employees',(request, response) => {
    console.log(request.query);

    const {
        query: { filter, value },
    } = request;

    if (!filter && !value) return response.send(mockEmployees);
    if (filter && value) {
        return response.send(
            mockEmployees.filter((user) => user[filter].includes(value))
        );
    }

    return response.send(mockEmployees);
});

app.get('/api/employees/:id', (request, response) => {
    console.log(request.params);    
    const parsedInt = parseInt(request.params.id);
    if (isNaN(parsedInt)) return response.status(400).send('Bad request.');

    let found = false;

    for (let i = 0; i < mockEmployees.length; i++) {
        if (mockEmployees[i].id === parsedInt) {
            found = true;
            return response.send({id: mockEmployees[i].id, name: mockEmployees[i].name});
        }
    }
    if (!found) {
        return response.status(404).send("Employee not found");
    }

});

app.get('/test', (req, res) => {
    res.render('test', {
        title: 'This is the page title!'
    });
});

app.post('/api/employees', (request, response) => {
    console.log(request.body);
    const body = request.body;
    const newUser = {
        id: mockEmployees[mockEmployees.length - 1].id + 1,
        ...body  
    };
    mockEmployees.push(newUser);
    console.log(mockEmployees.at(-1).name);
    response.status(201).send('201 Created');
})

// Starta servern
app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});