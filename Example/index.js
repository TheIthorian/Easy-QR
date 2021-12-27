window.addEventListener("load", function(){
    document.getElementById("submit").addEventListener("click", function(){
        removeError();
        let data = document.getElementById("input").value.trim();
        let mode = document.getElementById("mode-select").value;
        let errorCorrection = document.getElementById("error-correction-select").value;

        let qr = new QRCode("qr", data, mode, errorCorrection);
        console.log(qr.error.active);
        if (qr.error.active) {
            addError(ERROR_LOOKUP[qr.error.errorCode]);
            qr.removeError();
        }
        else {
            qr.display();
        }
    });
});

function addError(errorText) {
    let errorDiv = document.getElementById("error");
    errorDiv.innerText = errorText;
    errorDiv.classList.add("active");
}

function removeError() {
    let errorDiv = document.getElementById("error");
    errorDiv.innerText = "";
    errorDiv.classList.remove("active");
}