const Flight = require('../models/Flight'); 
const SpacePort = require('../models/SpacePort');
const session = require('express-session');

exports.searchFlights = async (req, res) => {
    try {
        const {
            query: { origin, destination, outboundDate, returnDate, adultCount, childCount, travelClass }
        } = req;

        req.session.searchQuery = req.query;

        const startOfDepartureDay = new Date(outboundDate);
        startOfDepartureDay.setHours(0, 0, 0, 0);

        const endOfDepartureDay = new Date(outboundDate);
        endOfDepartureDay.setHours(23, 59, 59, 999);

        const childNum = Number(childCount || 0);
        const adultNum = Number(adultCount || 0);
        const totalPassengers = childNum + adultNum;

        // Formatting dates for display
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        });

        const formattedDates = {
            formattedOutDate: outboundDate ? formatter.format(new Date(outboundDate)) : '',
            formattedReturnDate: returnDate ? formatter.format(new Date(returnDate)) : 'No return date'
        };

        const departureSpacePort = await SpacePort.findOne({ cityName: origin });
        const destinationSpacePort = destination ? await SpacePort.findOne({ cityName: destination }) : null;

        if (!departureSpacePort || (destination && !destinationSpacePort)) {
            return res.render('flights', {
                out: [],
                in: [],
                formattedDatesObject: formattedDates,
                userQuery: req.query
            });
        }

        let outFlights = [];


        const seatCondition = [
            { $eq: ["$$seat.isBooked", false] }
        ];
        if (travelClass) {
            seatCondition.push({ $eq: ["$$seat.class", travelClass] });
        }

        const seatsQuery = {
            $expr: {
                $gte: [
                    {
                        $size: {
                            $filter: {
                                input: "$seats",
                                as: "seat",
                                cond: { $and: seatCondition }
                            }
                        }
                    },
                    totalPassengers
                ]
            }
        };

        if (!destination) {
            outFlights = await Flight.find({
                departureSpacePort: departureSpacePort._id,
                departureDateAndTime: {
                    $gte: startOfDepartureDay,
                    $lte: endOfDepartureDay
                },
                ...seatsQuery
            }).populate('departureSpacePort destinationSpaceport');
        } else {
            outFlights = await Flight.find({
                departureSpacePort: departureSpacePort._id,
                destinationSpaceport: destinationSpacePort._id,
                departureDateAndTime: {
                    $gte: startOfDepartureDay,
                    $lte: endOfDepartureDay
                },
                ...seatsQuery
            }).populate('departureSpacePort destinationSpaceport');
        }

        let inFlights = [];

        if (returnDate && destinationSpacePort) {
            const startOfReturnDay = new Date(returnDate);
            startOfReturnDay.setHours(0, 0, 0, 0);

            const endOfReturnDay = new Date(returnDate);
            endOfReturnDay.setHours(23, 59, 59, 999);

            inFlights = await Flight.find({
                departureSpacePort: destinationSpacePort._id, 
                destinationSpaceport: departureSpacePort._id, 
                departureDateAndTime: {
                    $gte: startOfReturnDay,
                    $lte: endOfReturnDay
                },
                ...seatsQuery
            }).populate('departureSpacePort destinationSpaceport');
        }

        

        const flightsViewModel = {
            out: outFlights,
            in: inFlights,
            formattedDatesObject: formattedDates,
            userQuery: req.query
        };

        return res.status(200).render('flights', flightsViewModel);

    } catch (error) {
        console.error('Error searching flights:', error);
        res.status(500).send('Internal server error');
    }
};

exports.initBooking = async (req, res) => {
    const {
        query: { flightNumber, isBookingReturnFlight, actionIsForReturnFlight } } = req

        if (flightNumber) {

            const flight = await Flight.findOne({ flightNumber: flightNumber})
            
            if (flight) {
                if (!actionIsForReturnFlight) {
                    req.session.outFlight = flight;
                    req.session.isOutFlightChosen = true;

                    if (isBookingReturnFlight) {
                        return res.status(200).render('flights') // Det är här jag insåg att jag ville kalla på den andra metoden
                    }
                    else {
                        return res.status(200).render('bookingSeatsStep', {
                            outFlight: req.session.outFlight,
                            inFlight: false
                        });
                    }
                }
                else {
                    req.session.inFlight = flight;
                    req.session.isInFlightChosen = true;
                    return res.status(200).render('bookingSeatsStep', {
                            outFlight: req.session.outFlight,
                            inFlight: flight
                        });

                    
                }
            }
            else {
                return res.status(404).send('404 - Flight not found. We apologize for this error.');
            }
        }
        else {
            return res.status(400).send('400 - Request information was incomplete. We apologize for this error.');
        }

        
        if (isBookingReturnFlight) {

        }

        // Case: the user is booking a one way ticket and wants to proceed booking it.  
        else if (!isBookingReturnFlight) {

        }
        



};