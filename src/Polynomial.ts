// Initialise reed-soloman generator polynomial constants
const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);

for (let exponent = 1, value = 1; exponent < 256; exponent++) {
    value = value > 127 ? (value << 1) ^ 285 : value << 1;
    LOG[value] = exponent % 255;
    EXP[exponent % 255] = value;
}

function mul(a: number, b: number): number {
    return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
}

function div(a: number, b: number): number {
    return EXP[(LOG[a] + LOG[b] * 254) % 255];
}

function polyMul(poly1: Uint8Array, poly2: Uint8Array): Uint8Array {
    const coefficients = new Uint8Array(poly1.length + poly2.length - 1);

    for (let index = 0; index < coefficients.length; index++) {
        let coefficient = 0;
        for (let p1Index = 0; p1Index <= index; p1Index++) {
            const p2Index = index - p1Index;
            coefficient ^= mul(poly1[p1Index], poly2[p2Index]);
        }
        coefficients[index] = coefficient;
    }
    return coefficients;
}

export function polyRest(dividend: Uint8Array, divisor: Uint8Array) {
    const quotientLength = dividend.length - divisor.length + 1;
    let rest = new Uint8Array(dividend);

    for (let count = 0; count < quotientLength; count++) {
        if (rest[0]) {
            const factor = div(rest[0], divisor[0]);
            const subtr = new Uint8Array(rest.length);
            subtr.set(polyMul(divisor, new Uint8Array([factor])), 0);
            rest = rest.map((value, index) => value ^ subtr[index]).slice(1);
        } else {
            rest = rest.slice(1);
        }
    }
    return rest;
}

export function getGeneratorPoly(degree: number): Uint8Array {
    let lastPoly = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[i]]));
    }
    return lastPoly;
}

export function getEDC(data: number[], codewords: number) {
    const degree = codewords - data.length;
    const messagePoly = new Uint8Array(codewords);
    messagePoly.set(data, 0);
    return polyRest(messagePoly, getGeneratorPoly(degree));
}
