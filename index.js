window.addEventListener('load', function () {
    document.getElementById('submit').addEventListener('click', function () {
        removeError();

        let data = document.getElementById('input').value.trim();
        let mode = document.getElementById('mode-select').value;
        let errorCorrection = document.getElementById('error-correction-select').value;
        let qr;

        try {
            qr = new QR('qr', data, mode, errorCorrection);
            qr.printCodeToCanvas();
        } catch (err) {
            console.log(err);
            addError(err);
        }
    });
});

function addError(errorText) {
    let errorDiv = document.getElementById('error');
    errorDiv.innerText = errorText;
    errorDiv.classList.add('active');
}

function removeError() {
    let errorDiv = document.getElementById('error');
    errorDiv.innerText = '';
    errorDiv.classList.remove('active');
}
