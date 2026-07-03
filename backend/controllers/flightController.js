const Flight = require('../models/Flight'); 


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

        // Formatting dates for display purposes
        const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
        });

        const formattedDates = {
            formattedOutDate : formatter.format(new Date(outboundDate)),
            formattedReturnDate : formatter.format(new Date(returnDate))
        };

        let outFlights = null;

            // Do not filter for destination if it is left empty by the user
        if (!destination) {
             outFlights = await Flight.find({
            departureLocation: origin,
            departureDateAndTime: {
                $gte: startOfDepartureDay,
                $lte: endOfDepartureDay
            },
            $expr:{
                $gte: [
                    { $size: {
                        $filter: {
                            input: "$seats",
                            as: "seat",
                            cond: { $eq: ["$$seat.isBooked", false] }
                        }
                    }},
                    totalPassengers
                ]
            }

        });
            
        }
        else {
        outFlights = await Flight.find({
            departureLocation: origin,
            destinationLocation: destination,
            departureDateAndTime: {
                $gte: startOfDepartureDay,
                $lte: endOfDepartureDay
            },
            $expr:{
                $gte: [
                    { $size: {
                        $filter: {
                            input: "$seats",
                            as: "seat",
                            cond: {
                                $and: [ 
                                    { $eq: ["$$seat.isBooked", false] },
                                    { $eq: ["$$seat.class", travelClass] }
                                    ]    
                                }
                        }
                    }},
                    totalPassengers
                ]
            }

        });
    }
        if (returnDate) {

        const startOfReturnDay = new Date(returnDate);
        startOfReturnDay.setHours(0, 0, 0, 0);

        const endOfReturnDay = new Date(returnDate);
        endOfReturnDay.setHours(23, 59, 59, 999);

        const inFlights = await Flight.find({
            departureLocation: destination,
            destinationLocation: origin,
            departureDateAndTime: {
                $gte: startOfReturnDay,
                $lte: endOfReturnDay,
            },
            $expr:{
            $gte: [
                { $size: {
                    $filter: {
                        input: "$seats",
                        as: "seat",
                        cond: { $eq: ["$$seat.isBooked", false] }
                    }
                }},
                totalPassengers
            ]
            }
        })
            const flightsViewModel = {
            out: outFlights,
            in: inFlights,
            formattedDatesObject: formattedDates,
            userQuery: req.query
            };

            return res.status(200).render('flights', flightsViewModel);
        }
        else {
            const flightsViewModel = {
                out: outFlights,
                in: null,
                formattedDatesObject: formattedDates,
                userQuery: req.query
            };

            return res.status(200).render('flights', flightsViewModel);

        }

    } catch (error) {
        res.status(500).send('Internal server error');
        console.log(error);
    }
}

