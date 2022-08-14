import { polyRest } from './Polynomial.js';
/*
TODO:
 - Remove old comments and logs
 - Add finder patterns for v2+
 - Add all other masks and optimise
 - Does not work for v22, H: Hello there, I need to make this a large qr code so that more things are used Hello there, I need to make this a large qr code so that more things are used Hello there, I need to make this a large qr code so that more things are used Hello there, I need to make this a large qr code so that more things are used Hello there, I need to make this a large qr code so that more things are used r code so that more things are used
  > Incorrect codewords. I think this is due to the cahracter length map
*/
export class QRArray {
    constructor(qrCode, codewords) {
        this.data = codewords;
        this.correctionLevel = qrCode.correctionLevel;
        this.array = [];
        this.size = qrCode.size;
        this.version = qrCode.version;
        for (let i = 0; i < this.size * this.size; i++) {
            this.array[i] = '';
        }
    }
    coordToIndex(x, y) {
        return this.size * y + x;
    }
    indexToCorrd(i) {
        return [i % this.size, Math.floor(i / this.size) + 1];
    }
    addTimingPattern() {
        let toggle = true;
        for (let i = 0; i < this.size; i++) {
            this.array[this.coordToIndex(6, i)] = toggle ? '1' : '0';
            toggle = !toggle;
        }
        toggle = true;
        for (let i = 0; i < this.size; i++) {
            this.array[this.coordToIndex(i, 6)] = toggle ? '1' : '0';
            toggle = !toggle;
        }
    }
    addFinderPattern() {
        const LARGE_SQURE = [
            ['1', '1', '1', '1', '1', '1', '1'],
            ['1', '0', '0', '0', '0', '0', '1'],
            ['1', '0', '1', '1', '1', '0', '1'],
            ['1', '0', '1', '1', '1', '0', '1'],
            ['1', '0', '1', '1', '1', '0', '1'],
            ['1', '0', '0', '0', '0', '0', '1'],
            ['1', '1', '1', '1', '1', '1', '1'],
        ];
        const startPositions = [
            0,
            this.size - LARGE_SQURE.length,
            this.size * (this.size - LARGE_SQURE.length),
        ];
        for (let position of startPositions) {
            for (let i = 0; i < LARGE_SQURE.length; i++) {
                for (let j = 0; j < LARGE_SQURE.length; j++) {
                    this.array[position + i + this.size * j] = LARGE_SQURE[i][j];
                }
            }
        }
        // Additional white space around each square
        // Top left
        for (let i = 0; i < 9; i++) {
            this.array[this.coordToIndex(7, i)] = '0';
            this.array[this.coordToIndex(i, 7)] = '0';
            this.array[this.coordToIndex(8, i)] = '0';
            this.array[this.coordToIndex(i, 8)] = '0';
        }
        this.array[this.coordToIndex(8, 6)] = '1'; // Always here
        this.array[this.coordToIndex(6, 8)] = '1';
        // Top right
        for (let i = 0; i < 8; i++) {
            this.array[this.coordToIndex(this.size - 8 + i, 7)] = '0';
            this.array[this.coordToIndex(this.size - 8, i)] = '0';
        }
        // Bottom left
        for (let i = 0; i < 9; i++) {
            this.array[this.coordToIndex(7, this.size - i)] = '0';
            this.array[this.coordToIndex(i, this.size - 8)] = '0';
        }
        this.array[this.coordToIndex(8, this.size - 8)] = '1';
    }
    addSmallFinderPatterns() {
        let patternLocations = this.getAlignmentPatternPositions();
        for (let x = 0; x < patternLocations.length; x++) {
            for (let y = 0; y < patternLocations.length; y++) {
                if ((x == 0 && y == 0) || // // Always blocked by the large finder pattern
                    (x == 0 && y == patternLocations.length - 1) ||
                    (x == patternLocations.length - 1 && y == 0)) {
                    continue;
                }
                else {
                    this.addSmallerFinderSquare(patternLocations[x], patternLocations[y]);
                }
            }
        }
    }
    addSmallerFinderSquare(x, y) {
        const SMALL_SQUARE = [
            ['1', '1', '1', '1', '1'],
            ['1', '0', '0', '0', '1'],
            ['1', '0', '1', '0', '1'],
            ['1', '0', '0', '0', '1'],
            ['1', '1', '1', '1', '1'],
        ];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.array[this.coordToIndex(x - 2 + i, y - 2 + j)] = SMALL_SQUARE[i][j];
            }
        }
    }
    getAlignmentPatternPositions() {
        // TODO: Make this return a ist of points instead
        if (this.version == 1)
            return [];
        else {
            const numAlign = Math.floor(this.version / 7) + 2;
            const step = this.version == 32
                ? 26
                : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
            let result = [6];
            for (let pos = this.size - 7; result.length < numAlign; pos -= step)
                result.splice(1, 0, pos);
            return result;
        }
    }
    addVersionInformation() {
        if (this.version < 7) {
            return;
        }
        let data = this.getVersionInformation(this.version);
        for (let row = 0; row < 6; row++) {
            for (let column = 0; column < 3; column++) {
                // console.log(`x: ${row}, y: ${this.size - 11 + column}, bit: ${data[3*row + column]}`);
                this.array[this.coordToIndex(row, this.size - 11 + column)] =
                    data[3 * row + column].toString();
                this.array[this.coordToIndex(this.size - 11 + column, row)] =
                    data[3 * row + column].toString();
            }
        }
    }
    getVersionInformation(version) {
        const VERSION_DIVISOR = new Uint8Array([1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1]);
        const poly = Uint8Array.from(version.toString(2).padStart(6, '0') + '000000000000');
        poly.set(polyRest(poly, VERSION_DIVISOR), 6);
        return poly;
    }
    placeCodewordHorizontalPair(index, x, y) {
        if (x < 0 || y < 0) {
            return;
        }
        console.log(index, x, y, this.data[index]);
        this.array[this.coordToIndex(x, y)] = this.data[index];
        console.log(index + 1, x - 1, y, this.data[index + 1]);
        this.array[this.coordToIndex(x - 1, y)] = this.data[index + 1];
    }
    placeCodewordPair(index, x, y) {
        console.log(index, x, y, this.data[index]);
        this.array[this.coordToIndex(x, y)] = this.data[index];
    }
    placeCodewordVerticalPair(index, x, y, goingUp) {
        let direction = goingUp ? 1 : -1;
        this.array[this.coordToIndex(x, y)] = this.data[index];
        for (let i = 1; i <= 6; i++) {
            this.array[this.coordToIndex(x, y + direction * i)] = this.data[index + i];
        }
        index += 6;
        y += 6 * direction;
    }
    addCodewords() {
        // position initialized to bottom right
        let x_pos, y_pos, goingUp;
        goingUp = true;
        x_pos = this.size - 1;
        y_pos = this.size - 1;
        let alignmetPatternPositions = this.getAlignmentPatternPositions();
        console.log(this.getAlignmentPatternPositions());
        console.log(this.version, this.data.length);
        for (let i = 0; i < this.data.length; i += 2) {
            if (i == 0) {
                this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                y_pos--;
                continue;
            }
            if (goingUp) {
                if (this.version >= 7 && y_pos == 7 && x_pos == this.size - 9) {
                    // At version info
                    [i, x_pos, y_pos, goingUp] = this.skipVersionInfo(i, x_pos, y_pos, goingUp);
                }
                else if ((y_pos == 9 && (x_pos > this.size - 8 || x_pos <= 8)) || y_pos == 0) {
                    // At bounary
                    [i, x_pos, y_pos, goingUp] = this.placeBoundaryCells(i, x_pos, y_pos, goingUp);
                }
                else if (alignmetPatternPositions.includes(y_pos - 3) &&
                    alignmetPatternPositions.includes(x_pos - 2)) {
                    // At alignment pattern
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos -= 6;
                }
                else if (this.isAtAlignmentPattern(x_pos, y_pos, alignmetPatternPositions, goingUp)) {
                    // At alignment pattern
                    console.log('Alignment pattern up', x_pos, y_pos);
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    i += 2;
                    x_pos--;
                    y_pos--;
                    for (let _ = 0; _ < 5; _++) {
                        this.placeCodewordPair(i, x_pos, y_pos);
                        y_pos--;
                        i++;
                    }
                    i -= 2;
                    x_pos++;
                }
                else if (y_pos == 6) {
                    // Skip over timing pattern
                    y_pos--;
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos--;
                }
                else {
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos--;
                }
            }
            else if (!goingUp) {
                // Going down
                if (y_pos == this.size - 1 && x_pos == 10) {
                    // At lower timing boundary
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    x_pos = 8;
                    y_pos = this.size - 9;
                    goingUp = true;
                }
                else if ((y_pos == this.size - 9 && x_pos <= 8) || y_pos == this.size - 1) {
                    // At bounary
                    [i, x_pos, y_pos, goingUp] = this.placeBoundaryCells(i, x_pos, y_pos, goingUp);
                }
                else if (this.isAtAlignmentPattern(x_pos, y_pos, alignmetPatternPositions, goingUp)) {
                    console.log('Alignment pattern down:', x_pos, y_pos);
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos += 6;
                }
                else if (y_pos == 6) {
                    // Skip over timing pattern
                    y_pos++;
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos++;
                }
                else {
                    this.placeCodewordHorizontalPair(i, x_pos, y_pos);
                    y_pos++;
                }
            }
            if (x_pos < 0) {
                return;
            }
        }
    }
    skipVersionInfo(i, x_pos, y_pos, goingUp) {
        if (goingUp) {
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            y_pos = 0;
            x_pos = this.size - 12;
            i++;
            for (let j = 0; j < 6; j++) {
                this.array[this.coordToIndex(x_pos, y_pos + j)] = this.data[i];
                console.log(x_pos, y_pos + j, i);
                i++;
            }
            y_pos = 7;
            x_pos = this.size - 11;
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            y_pos++;
            goingUp = false;
            return [i, x_pos, y_pos, goingUp];
        }
        else {
            return;
        }
    }
    placeBoundaryCells(i, x_pos, y_pos, goingUp) {
        if (goingUp) {
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            i += 2;
            // Vertical timing pattern
            x_pos == 8 && y_pos == 9 ? (x_pos -= 3) : (x_pos -= 2);
            goingUp = false;
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            y_pos++;
            return [i, x_pos, y_pos, goingUp];
        }
        else {
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            x_pos -= 2;
            i += 2;
            goingUp = true;
            this.placeCodewordHorizontalPair(i, x_pos, y_pos);
            y_pos--;
            return [i, x_pos, y_pos, goingUp];
        }
    }
    isAtAlignmentPattern(x_pos, y_pos, alignmetPatternPositions, goingUp) {
        if (goingUp) {
            return (alignmetPatternPositions.includes(y_pos - 3) &&
                alignmetPatternPositions.includes(x_pos + 2) &&
                !(alignmetPatternPositions[0] == x_pos + 2 &&
                    alignmetPatternPositions[0] == y_pos - 3) &&
                !(alignmetPatternPositions[0] == x_pos + 2 &&
                    alignmetPatternPositions[alignmetPatternPositions.length - 1] == y_pos - 3) &&
                !(alignmetPatternPositions[0] == y_pos - 3 &&
                    alignmetPatternPositions[alignmetPatternPositions.length - 1] == x_pos + 2));
        }
        else {
            return (alignmetPatternPositions.includes(y_pos + 3) &&
                (alignmetPatternPositions.includes(x_pos) ||
                    alignmetPatternPositions.includes(x_pos + 1)) &&
                !(alignmetPatternPositions[0] == x_pos && alignmetPatternPositions[0] == y_pos + 3) &&
                !(alignmetPatternPositions[0] == x_pos &&
                    alignmetPatternPositions[alignmetPatternPositions.length - 1] == y_pos + 3) &&
                !(alignmetPatternPositions[0] == x_pos + 1 &&
                    alignmetPatternPositions[alignmetPatternPositions.length - 1] == y_pos + 3) &&
                !(alignmetPatternPositions[0] == y_pos + 3 &&
                    alignmetPatternPositions[alignmetPatternPositions.length - 1] == x_pos));
        }
    }
    applyMasks() {
        //https://dev.to/maxart2501/let-s-develop-a-qr-code-generator-part-v-masking-30dl
        //https://www.nayuki.io/page/creating-a-qr-code-step-by-step
        for (let i = 0; i < this.array.length; i++) {
            if (i % 2 == 0) {
                this.array[i] = (parseInt(this.array[i]) ^ 1).toString();
            }
            else {
                this.array[i] = (parseInt(this.array[i]) ^ 0).toString();
            }
        }
    }
    addErrorLevel() {
        let maskIndex = 0;
        const EDC_ORDER = 'MLHQ';
        const FORMAT_DIVISOR = new Uint8Array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]);
        const FORMAT_MASK = new Uint8Array([1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]);
        const formatPoly = new Uint8Array(15);
        const errorLevelIndex = EDC_ORDER.indexOf(this.correctionLevel);
        formatPoly[0] = errorLevelIndex >> 1;
        formatPoly[1] = errorLevelIndex & 1;
        formatPoly[2] = maskIndex >> 2;
        formatPoly[3] = (maskIndex >> 1) & 1;
        formatPoly[4] = maskIndex & 1;
        const rest = polyRest(formatPoly, FORMAT_DIVISOR);
        formatPoly.set(rest, 5);
        let maskedFormatPoly = formatPoly.map((bit, index) => bit ^ FORMAT_MASK[index]);
        for (let i = 0; i < 7; i++) {
            let val;
            if (maskedFormatPoly[i] == 254) {
                val = '1';
            }
            else if (maskedFormatPoly[i] == 255) {
                val = '0';
            }
            else {
                val = maskedFormatPoly[i].toString();
            }
            let dx = 0;
            if (i > 5) {
                dx = 1;
            }
            this.array[this.coordToIndex(i + dx, 8)] = val; // Top left - bottom
            this.array[this.coordToIndex(8, this.size - i - 1)] = val; // Bottom left - right
            // console.log(i, val);
        }
        for (let i = 7; i < 15; i++) {
            let val;
            if (maskedFormatPoly[i] == 254) {
                val = '1';
            }
            else if (maskedFormatPoly[i] == 255) {
                val = '0';
            }
            else {
                val = maskedFormatPoly[i].toString();
            }
            let dy = 0;
            if (i > 8) {
                dy = 1;
            }
            this.array[this.coordToIndex(8, 15 - i - dy)] = val; // Top left - right
            this.array[this.coordToIndex(this.size - 15 + i, 8)] = val; // Top right - bottom
        }
    }
    addAlternating() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.array[i] = i % 2 ? '0' : '1';
        }
    }
}
const MASK_FUNCTIONS = [
    (row, column) => ((row + column) & 1) === 0,
    (row, column) => (row & 1) === 0,
    (row, column) => column % 3 === 0,
    (row, column) => (row + column) % 3 === 0,
    (row, column) => (((row >> 1) + Math.floor(column / 3)) & 1) === 0,
    (row, column) => ((row * column) & 1) + ((row * column) % 3) === 0,
    (row, column) => ((((row * column) & 1) + ((row * column) % 3)) & 1) === 0,
    (row, column) => ((((row + column) & 1) + ((row * column) % 3)) & 1) === 0,
];
//# sourceMappingURL=QRArray.js.map