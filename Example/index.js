window.addEventListener("load", function(){
    document.getElementById("submit").addEventListener("click", function(){
        let data = document.getElementById("input").value.trim();
        let mode = document.getElementById("mode-select").value;
        let errorCorrection = document.getElementById("error-correction-select").value;

        let qr = new QRCode("qr", data, mode, errorCorrection);
        if (qr.error.active) {
            document.getElementById("error").innerText = ERROR_LOOKUP[qr.error.errorCode];
            qr.removeError();
        }
        else {
            qr.display();
        }
    });
});