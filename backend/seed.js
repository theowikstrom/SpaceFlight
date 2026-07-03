require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');

const mongoUrl = process.env.MONGODB_URI;

const flightsData = [
  {
    "flightNumeber": 201,
    "departureLocation": "Kiruna (Earth)",
    "destinationLocation": "Lavenia (Yater)",
    "departureDateAndTime": "2026-12-24T08:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false },
      { "seatNumber": "1B", "row": 1, "letter": "B", "class": "First", "isBooked": true },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false },
      { "seatNumber": "2B", "row": 2, "letter": "B", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 202,
    "departureLocation": "Lavenia (Yater)",
    "destinationLocation": "Kiruna (Earth)",
    "departureDateAndTime": "2027-01-05T12:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 203,
    "departureLocation": "Neo-Tokyo (Earth)",
    "destinationLocation": "Xylar City (Zendora)",
    "departureDateAndTime": "2026-12-25T14:30:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "1B", "row": 1, "letter": "B", "class": "Business", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": true }
    ]
  },
  {
    "flightNumeber": 204,
    "departureLocation": "Xylar City (Zendora)",
    "destinationLocation": "Neo-Tokyo (Earth)",
    "departureDateAndTime": "2027-01-02T18:15:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 205,
    "departureLocation": "Kiruna (Earth)",
    "destinationLocation": "Solaria Prime (Helios)",
    "departureDateAndTime": "2026-12-24T22:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": true },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": true }
    ]
  },
  {
    "flightNumeber": 206,
    "departureLocation": "Solaria Prime (Helios)",
    "destinationLocation": "Kiruna (Earth)",
    "departureDateAndTime": "2027-01-06T04:45:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 207,
    "departureLocation": "Vulkania (Krypton-X)",
    "destinationLocation": "Lavenia (Yater)",
    "departureDateAndTime": "2026-12-26T10:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 208,
    "departureLocation": "Lavenia (Yater)",
    "destinationLocation": "Vulkania (Krypton-X)",
    "departureDateAndTime": "2027-01-04T15:30:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": true },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 209,
    "departureLocation": "Aquadome (Oceanus)",
    "destinationLocation": "Neo-Tokyo (Earth)",
    "departureDateAndTime": "2026-12-27T06:15:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Economy", "isBooked": false },
      { "seatNumber": "1B", "row": 1, "letter": "B", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 210,
    "departureLocation": "Neo-Tokyo (Earth)",
    "destinationLocation": "Aquadome (Oceanus)",
    "departureDateAndTime": "2027-01-03T21:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Economy", "isBooked": false },
      { "seatNumber": "1B", "row": 1, "letter": "B", "class": "Economy", "isBooked": true }
    ]
  },
  {
    "flightNumeber": 211,
    "departureLocation": "Kiruna (Earth)",
    "destinationLocation": "Xylar City (Zendora)",
    "departureDateAndTime": "2026-12-24T13:15:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "3A", "row": 3, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 212,
    "departureLocation": "Xylar City (Zendora)",
    "destinationLocation": "Kiruna (Earth)",
    "departureDateAndTime": "2027-01-07T11:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": true },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 213,
    "departureLocation": "Lavenia (Yater)",
    "destinationLocation": "Solaria Prime (Helios)",
    "departureDateAndTime": "2026-12-28T17:45:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 214,
    "departureLocation": "Solaria Prime (Helios)",
    "destinationLocation": "Lavenia (Yater)",
    "departureDateAndTime": "2027-01-02T09:30:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false },
      { "seatNumber": "2A", "row": 2, "letter": "A", "class": "Economy", "isBooked": true }
    ]
  },
  {
    "flightNumeber": 215,
    "departureLocation": "Vulkania (Krypton-X)",
    "destinationLocation": "Aquadome (Oceanus)",
    "departureDateAndTime": "2026-12-29T12:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 216,
    "departureLocation": "Aquadome (Oceanus)",
    "destinationLocation": "Vulkania (Krypton-X)",
    "departureDateAndTime": "2027-01-08T16:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Economy", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 217,
    "departureLocation": "Kiruna (Earth)",
    "destinationLocation": "Lavenia (Yater)",
    "departureDateAndTime": "2026-12-24T19:30:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false },
      { "seatNumber": "1B", "row": 1, "letter": "B", "class": "First", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 218,
    "departureLocation": "Lavenia (Yater)",
    "destinationLocation": "Kiruna (Earth)",
    "departureDateAndTime": "2027-01-05T23:15:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "First", "isBooked": false }
    ]
  },
  {
    "flightNumeber": 219,
    "departureLocation": "Xylar City (Zendora)",
    "destinationLocation": "Solaria Prime (Helios)",
    "departureDateAndTime": "2026-12-30T05:00:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": true }
    ]
  },
  {
    "flightNumeber": 220,
    "departureLocation": "Solaria Prime (Helios)",
    "destinationLocation": "Xylar City (Zendora)",
    "departureDateAndTime": "2027-01-09T13:20:00.000Z",
    "seats": [
      { "seatNumber": "1A", "row": 1, "letter": "A", "class": "Business", "isBooked": false }
    ]
  }
]

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('Seedfile connected to DB');

        await Flight.deleteMany({});
        await Flight.insertMany(flightsData);

        await mongoose.connection.close();
        console.log('🔌 Anslutning stängd.');

    } catch (error) {
        console.error('Ett fel inträffade: ' + error);
    }
}

seedDatabase();
