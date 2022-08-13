// Initialise reed-soloman generator polynomial constants
const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);
for (let exponent = 1, value = 1; exponent < 256; exponent++) {
    value = value > 127 ? (value << 1) ^ 285 : value << 1;
    LOG[value] = exponent % 255;
    EXP[exponent % 255] = value;
}

function mul(a, b) {
    return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
}

function div(a, b) {
    return EXP[(LOG[a] + LOG[b] * 254) % 255];
}

function polyMul(poly1, poly2) {
    const coeffs = new Uint8Array(poly1.length + poly2.length - 1);

    for (let index = 0; index < coeffs.length; index++) {
        let coeff = 0;
        for (let p1index = 0; p1index <= index; p1index++) {
            const p2index = index - p1index;
            coeff ^= mul(poly1[p1index], poly2[p2index]);
        }
        coeffs[index] = coeff;
    }
    return coeffs;
}

export function polyRest(dividend, divisor) {
    const quotientLength = dividend.length - divisor.length + 1;
    let rest = new Uint8Array(dividend);
    for (let count = 0; count < quotientLength; count++) {
        if (rest[0]) {
            const factor = div(rest[0], divisor[0]);
            const subtr = new Uint8Array(rest.length);
            subtr.set(polyMul(divisor, [factor]), 0);
            rest = rest.map((value, index) => value ^ subtr[index]).slice(1);
        } else {
            rest = rest.slice(1);
        }
    }
    return rest;
}

export function getGeneratorPoly(degree) {
    let lastPoly = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[i]]));
    }
    return lastPoly;
}

export function getEDC(data, codewords) {
    const degree = codewords - data.length;
    const messagePoly = new Uint8Array(codewords);
    messagePoly.set(data, 0);
    return polyRest(messagePoly, getGeneratorPoly(degree));
}
