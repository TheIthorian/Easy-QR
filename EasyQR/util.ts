// Converts a string to binary
export function toBinary(sInput: string): string {
    sInput = sInput.toString();

    var output = '';
    for (var i = 0; i < sInput.length; i++) {
        output += sInput[i].charCodeAt(0).toString(2);
    }

    return output;
}

// Converts a binary string to hexadecimal
export function binaryToHex(sBinary: string): string {
    return parseInt(sBinary, 2).toString(16);
}

// Converts an int to hexadecimal
export function intToHex(iInt: string): string {
    return parseInt(iInt, 10).toString(16);
}
