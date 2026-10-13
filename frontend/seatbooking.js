
function getSessionInfo() {

        const searchQuery = document.getElementById('userQuery');

        if (searchQuery) {
            const sessionData = JSON.parse(searchQuery.dataset.userquery);

            return sessionData;
        }

        return;
}

function getSeatsInfo(containerName, seatIndex) {
    
    if (containerName === "seatmap-outFlight") {
    const seat = document.getElementById(`outFlight-seat-${seatIndex}`);
    }

    else if (containerName === 'seatmap-inFlight') {
            const seat = document.getElementById(`inFlight-seat-${seatIndex}`);
    }

    if (seat) {
        const seatData = JSON.parse(seat.dataset.seatinfo);
        return seatData;
    }

}




function seatSelection(containerName) {

    const seatMapContainer = document.getElementById(containerName);
    const seats = document.querySelectorAll(`#${containerName} .seatmap-seat-real`);
    const searchQuery = getSessionInfo();
    let selectedSeats = [];


    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (selectedSeats.includes(seat)) {
                index = selectedSeats.indexOf(seat);    
                selectedSeats.splice(index, 1);    
                seat.style.backgroundColor = '#aeaeae';
            }

            else {

                seat.style.backgroundColor = '#0F1A64';
                selectedSeats.push(seat);

            }
        })
    });



} 

getSessionInfo();
seatSelection('seatmap-outFlight');