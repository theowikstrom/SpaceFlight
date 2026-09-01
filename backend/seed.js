require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const SpacePort = require('./models/SpacePort');


const mongoUrl = process.env.MONGODB_URI;

const SPACEPORTS = {
  kiruna: new mongoose.Types.ObjectId('650000000000000000000001'),
  lavenia: new mongoose.Types.ObjectId('650000000000000000000002'),
  neoTokyo: new mongoose.Types.ObjectId('650000000000000000000003'),
  xylarCity: new mongoose.Types.ObjectId('650000000000000000000004')
};


const spaceportsData = [
  {
    _id: new mongoose.Types.ObjectId('650000000000000000000001'),
    planetName: 'Earth',
    cityName: 'Kiruna',
    spaceportName: 'Kiruna Spaceport',
    ISTA: 'KRN'
  },
  {
    _id: new mongoose.Types.ObjectId('650000000000000000000002'),
    planetName: 'Yater',
    cityName: 'Lavenia',
    spaceportName: 'Lavenia Central Hub',
    ISTA: 'LVN'
  },
  {
    _id: new mongoose.Types.ObjectId('650000000000000000000003'),
    planetName: 'Earth',
    cityName: 'Neo-Tokyo',
    spaceportName: 'Neo-Tokyo Orbital Launchpad',
    ISTA: 'NTK'
  },
  {
    _id: new mongoose.Types.ObjectId('650000000000000000000004'),
    planetName: 'Zendora',
    cityName: 'Xylar City',
    spaceportName: 'Xylar Prime Terminal',
    ISTA: 'XYL'
  }
];


const flightsData = [
  {
    flightNumber: 301,
    departureSpacePort: SPACEPORTS.kiruna,
    destinationSpaceport: SPACEPORTS.lavenia,
    departureDateAndTime: new Date('2026-12-24T08:00:00.000Z'),
    arrivalDateAndTime: new Date('2026-12-24T18:30:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'First', price: mongoose.Types.Decimal128.fromString('8500.00'), isBooked: false },
      { seatNumber: '1B', row: 1, letter: 'B', class: 'First', price: mongoose.Types.Decimal128.fromString('8500.00'), isBooked: true },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2400.00'), isBooked: false },
      { seatNumber: '2B', row: 2, letter: 'B', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2400.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 302,
    departureSpacePort: SPACEPORTS.lavenia,
    destinationSpaceport: SPACEPORTS.kiruna,
    departureDateAndTime: new Date('2027-01-05T12:00:00.000Z'),
    arrivalDateAndTime: new Date('2027-01-05T22:30:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'First', price: mongoose.Types.Decimal128.fromString('8900.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2600.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 303,
    departureSpacePort: SPACEPORTS.neoTokyo,
    destinationSpaceport: SPACEPORTS.xylarCity,
    departureDateAndTime: new Date('2026-12-25T14:30:00.000Z'),
    arrivalDateAndTime: new Date('2026-12-26T04:15:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Business', price: mongoose.Types.Decimal128.fromString('5200.00'), isBooked: false },
      { seatNumber: '1B', row: 1, letter: 'B', class: 'Business', price: mongoose.Types.Decimal128.fromString('5200.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('1950.00'), isBooked: true }
    ]
  },
  {
    flightNumber: 304,
    departureSpacePort: SPACEPORTS.xylarCity,
    destinationSpaceport: SPACEPORTS.neoTokyo,
    departureDateAndTime: new Date('2027-01-02T18:15:00.000Z'),
    arrivalDateAndTime: new Date('2027-01-03T08:00:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Business', price: mongoose.Types.Decimal128.fromString('5400.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2100.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 305,
    departureSpacePort: SPACEPORTS.kiruna,
    destinationSpaceport: SPACEPORTS.xylarCity,
    departureDateAndTime: new Date('2026-12-24T22:00:00.000Z'),
    arrivalDateAndTime: new Date('2026-12-25T12:45:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'First', price: mongoose.Types.Decimal128.fromString('12000.00'), isBooked: true },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('3500.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 306,
    departureSpacePort: SPACEPORTS.xylarCity,
    destinationSpaceport: SPACEPORTS.kiruna,
    departureDateAndTime: new Date('2027-01-06T04:45:00.000Z'),
    arrivalDateAndTime: new Date('2027-01-06T19:30:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'First', price: mongoose.Types.Decimal128.fromString('11500.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('3200.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 307,
    departureSpacePort: SPACEPORTS.neoTokyo,
    destinationSpaceport: SPACEPORTS.lavenia,
    departureDateAndTime: new Date('2026-12-26T10:00:00.000Z'),
    arrivalDateAndTime: new Date('2026-12-26T21:15:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Business', price: mongoose.Types.Decimal128.fromString('6100.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2800.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 308,
    departureSpacePort: SPACEPORTS.lavenia,
    destinationSpaceport: SPACEPORTS.neoTokyo,
    departureDateAndTime: new Date('2027-01-04T15:30:00.000Z'),
    arrivalDateAndTime: new Date('2027-01-05T02:45:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Business', price: mongoose.Types.Decimal128.fromString('6100.00'), isBooked: false },
      { seatNumber: '2A', row: 2, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('2800.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 309,
    departureSpacePort: SPACEPORTS.kiruna,
    destinationSpaceport: SPACEPORTS.lavenia,
    departureDateAndTime: new Date('2026-12-27T06:15:00.000Z'),
    arrivalDateAndTime: new Date('2026-12-27T16:45:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('1700.00'), isBooked: false },
      { seatNumber: '1B', row: 1, letter: 'B', class: 'Economy', price: mongoose.Types.Decimal128.fromString('1700.00'), isBooked: false }
    ]
  },
  {
    flightNumber: 310,
    departureSpacePort: SPACEPORTS.lavenia,
    destinationSpaceport: SPACEPORTS.kiruna,
    departureDateAndTime: new Date('2027-01-03T21:00:00.000Z'),
    arrivalDateAndTime: new Date('2027-01-04T07:30:00.000Z'),
    seats: [
      { seatNumber: '1A', row: 1, letter: 'A', class: 'Economy', price: mongoose.Types.Decimal128.fromString('1750.00'), isBooked: false },
      { seatNumber: '1B', row: 1, letter: 'B', class: 'Economy', price: mongoose.Types.Decimal128.fromString('1750.00'), isBooked: true }
    ]
  }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('Seedfile connected to DB');

        await Flight.deleteMany({});
        await Flight.insertMany(flightsData);
        await SpacePort.deleteMany({});
        await SpacePort.insertMany(spaceportsData);


        await mongoose.connection.close();
        console.log('🔌 Anslutning stängd.');

    } catch (error) {
        console.error('Ett fel inträffade: ' + error);
    }
}

seedDatabase();
