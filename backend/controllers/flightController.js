exports.searchFlights = async (req, res) => {
    try {
        res.send('<h1>Yo!</h1>');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

