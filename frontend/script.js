const toggleReturnDateInput = () => {

    const returnDateContainer = document.getElementById('returnDateContainer');
    const returnTripToggleBtn = document.getElementById('returnToggle');
    const bookingFillerDiv = document.getElementById('bookingFillerDiv');

    returnTripToggleBtn.addEventListener('click', (e) => {
        
        returnDateContainer.hidden = !returnDateContainer.hidden; 
        bookingFillerDiv.classList.toggle('col-4');
        bookingFillerDiv.classList.toggle('col-10');

    });

}

toggleReturnDateInput();