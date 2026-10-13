const Flight = require('../models/Flight');
const SpacePort = require('../models/SpacePort');

const getDayRange = (date) => ({
    $gte: new Date(`${date}T00:00:00.000Z`),
    $lte: new Date(`${date}T23:59:59.999Z`)
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeSearchQuery = (query) => ({
    ...query,
    origin: query.origin.trim(),
    destination: query.destination ? query.destination.trim() : '',
    adultCount: String(query.adultCount),
    childCount: String(query.childCount || 0),
    travelClass: query.travelClass || 'Economy',
    returnDate: query.returnDate || ''
});

const getFlightsData = async (queryParams) => {
    const {
        origin,
        destination,
        outboundDate,
        returnDate,
        adultCount,
        childCount,
        travelClass
    } = queryParams;
    const totalPassengers = Number(adultCount) + Number(childCount);
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });
    const formattedDates = {
        formattedOutDate: outboundDate ? formatter.format(new Date(`${outboundDate}T00:00:00.000Z`)) : '',
        formattedReturnDate: returnDate
            ? formatter.format(new Date(`${returnDate}T00:00:00.000Z`))
            : 'No return date'
    };
    const departureSpacePort = await SpacePort.findOne({
        cityName: new RegExp(`^${escapeRegExp(origin)}$`, 'i')
    });
    const destinationSpacePort = destination
        ? await SpacePort.findOne({ cityName: new RegExp(`^${escapeRegExp(destination)}$`, 'i') })
        : null;

    const emptyResults = {
        out: [],
        in: [],
        formattedDatesObject: formattedDates,
        userQuery: queryParams
    };

    if (!departureSpacePort || (destination && !destinationSpacePort)) {
        return emptyResults;
    }

    const seatConditions = [{ $eq: ['$$seat.isBooked', false] }];
    if (travelClass) {
        seatConditions.push({ $eq: ['$$seat.class', travelClass] });
    }

    const seatsQuery = {
        $expr: {
            $gte: [
                {
                    $size: {
                        $filter: {
                            input: { $ifNull: ['$seats', []] },
                            as: 'seat',
                            cond: { $and: seatConditions }
                        }
                    }
                },
                totalPassengers
            ]
        }
    };
    const outboundQuery = {
        departureSpacePort: departureSpacePort._id,
        departureDateAndTime: getDayRange(outboundDate),
        ...seatsQuery
    };

    if (destinationSpacePort) {
        outboundQuery.destinationSpaceport = destinationSpacePort._id;
    }

    const outFlights = await Flight.find(outboundQuery)
        .populate('departureSpacePort destinationSpaceport');
    let inFlights = [];

    if (returnDate && destinationSpacePort) {
        inFlights = await Flight.find({
            departureSpacePort: destinationSpacePort._id,
            destinationSpaceport: departureSpacePort._id,
            departureDateAndTime: getDayRange(returnDate),
            ...seatsQuery
        }).populate('departureSpacePort destinationSpaceport');
    }

    return {
        out: outFlights,
        in: inFlights,
        formattedDatesObject: formattedDates,
        userQuery: queryParams
    };
};

const renderSeatsStep = (res, flightInfo) => res.status(200).render('bookingSeatsStep', {
    outFlight: flightInfo.outFlight,
    inFlight: flightInfo.inFlight,
    searchQuery: flightInfo.searchQuery

});

exports.searchFlights = async (req, res) => {
    try {
        const searchQuery = normalizeSearchQuery(req.query);
        req.session.searchQuery = searchQuery;
        delete req.session.outFlightId;
        delete req.session.inFlightId;

        const flightsViewModel = await getFlightsData(searchQuery);
        return res.status(200).render('flights', {
            flightsViewModel,
            actionIsForReturnFlight: false
        });
    } catch (error) {
        console.error('Error searching flights:', error);
        return res.status(500).send('Internal server error');
    }
};

exports.initBooking = async (req, res) => {
    try {
        const searchQuery = req.session.searchQuery;
        if (!searchQuery) {
            return res.status(400).send('Search for flights before selecting a flight.');
        }

        const flightsViewModel = await getFlightsData(searchQuery);
        const flightNumber = Number(req.query.flightNumber);

        if (!req.session.outFlightId) {
            const outFlight = flightsViewModel.out.find(
                (flight) => flight.flightNumber === flightNumber
            );
            if (!outFlight) {
                return res.status(409).send('This outbound flight is no longer available for your search.');
            }

            req.session.outFlightId = outFlight._id.toString();
            if (searchQuery.returnDate) {
                return res.status(200).render('flights', {
                    flightsViewModel,
                    actionIsForReturnFlight: true
                });
            }

            const flightInfo = {
                outFlight,
                inFlight,
                searchQuery

            }

            return renderSeatsStep(res, flightInfo);
        }

        const outFlight = flightsViewModel.out.find(
            (flight) => flight._id.toString() === req.session.outFlightId
        );
        if (!outFlight) {
            delete req.session.outFlightId;
            delete req.session.inFlightId;
            return res.status(409).send('This outbound flight is no longer available. Please search again.');
        }

        const inFlight = flightsViewModel.in.find(
            (flight) => flight.flightNumber === flightNumber
        );
        if (!inFlight) {
            return res.status(409).send('This return flight is no longer available for your search.');
        }

        req.session.inFlightId = inFlight._id.toString();
        return renderSeatsStep(res, {
            outFlight,
            inFlight,
            searchQuery
        });
    } catch (error) {
        console.error('Error initiating booking:', error);
        return res.status(500).send('Internal server error');
    }
};


