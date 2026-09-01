const Flight = require('../models/Flight'); 
const SpacePort = require('../models/SpacePort');

exports.searchFlights = async (req, res) => {
    try {
        const {
            query: { origin, destination, outboundDate, returnDate, adultCount, childCount, travelClass }
        } = req;

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

        // Om returresa är vald
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

exports.initBooking = (req, res) => {

    return res.status(200).send('So, you wanna book, I see?');
};