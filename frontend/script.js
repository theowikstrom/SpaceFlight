const toggleReturnDateInput = () => {
    const returnDateContainer = document.getElementById('returnDateContainer');
    const returnTripToggleBtn = document.getElementById('returnToggle');
    const bookingFillerDiv = document.getElementById('bookingFillerDiv');
    const returnDateInput = document.getElementById('landingInput');
    const destinationInput = document.getElementById('toInput');

    if (
        !returnDateContainer ||
        !returnTripToggleBtn ||
        !bookingFillerDiv ||
        !returnDateInput ||
        !destinationInput
    ) {
        return;
    }

    const updateReturnDateInput = () => {
        const isRoundTrip = returnTripToggleBtn.checked;
        returnDateContainer.hidden = !isRoundTrip;
        returnDateInput.disabled = !isRoundTrip;
        returnDateInput.required = isRoundTrip;
        destinationInput.required = isRoundTrip;
        bookingFillerDiv.classList.toggle('col-4', isRoundTrip);
        bookingFillerDiv.classList.toggle('col-10', !isRoundTrip);
    };

    returnTripToggleBtn.addEventListener('change', updateReturnDateInput);
    updateReturnDateInput();
}

toggleReturnDateInput();