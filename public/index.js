import '../dist/main.js';

window.addEventListener('load', function () {
    // import('../dist/main.js').then(ex => {
    document.getElementById('submit').addEventListener('click', function () {
        removeError();

        const elements = {
            textInput: document.getElementById('input'),
            modeInput: document.getElementById('mode-select'),
            errorCorrectionInput: document.getElementById('error-correction-select'),
        };

        const data = elements.textInput.value.trim();
        const mode = elements.modeInput.value;
        const errorCorrection = elements.errorCorrectionInput.value;

        try {
            const qr = new QR('qr', data, mode, errorCorrection);
            qr.printCodeToCanvas();
            console.log(qr.getCode().join(''));
        } catch (err) {
            console.log(err);
            addError(err);
        }
    });
    // });
});

function addError(errorText) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = errorText;
    errorDiv.classList.add('active');
}

function removeError() {
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = '';
    errorDiv.classList.remove('active');
}
