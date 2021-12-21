window.addEventListener("load", function(){
    document.getElementById("submit").addEventListener("click", function(){
        //displayCode(generateCode(document.getElementById("input").value.trim(), settings)); 
        let data = document.getElementById("input").value.trim();
        let qr = new QRCode("qr", data, 'Byte', 'Q');
        //let qr = new QRCode("qr", data, 'Numeric', 'L');
        qr.display();
        qr.log();
    });
});