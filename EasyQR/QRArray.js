/*
TODO:
 - Remove old comments and logs
 - Add finder patterns for v2+
 - Add all other masks and optimise
*/

class QRArray {

    constructor(size, data, correctionLevel) {

        this.data = data;
        this.correctionLevel = correctionLevel;

        this.array = [];
        this.size = size;

        for (let i = 0; i < size * size; i++) {
            this.array[i] = '';
        }
        
    }

    coordToIndex(x, y) {
        return this.size * (y) + x;
    }

    indexToCorrd(i) {
        return [i % this.size, Math.floor(i / this.size) + 1];
    }

    addTimingPattern() {
        let toggle = true;

        for (let i = 0; i < this.size; i++) {            
            this.array[this.coordToIndex(6, i)] = toggle ? "1" : "0";
            toggle = !toggle;
        } 

        toggle = true;
        for (let i = 0; i < this.size; i++) {            
            this.array[this.coordToIndex(i, 6)] = toggle ? "1" : "0";
            toggle = !toggle;
        } 
    }

    addFinderPattern() {
        const square = [
            ["1","1","1","1","1","1","1"],
            ["1","0","0","0","0","0","1"],
            ["1","0","1","1","1","0","1"],
            ["1","0","1","1","1","0","1"],
            ["1","0","1","1","1","0","1"],
            ["1","0","0","0","0","0","1"],
            ["1","1","1","1","1","1","1"]
        ];

        const startPositions = [0, this.size - square.length, 
            this.size * (this.size - square.length)];

        for (let position of startPositions) {
            for (let i = 0; i < square.length; i++) {
                for (let j = 0; j < square.length; j++) {
                    
                    this.array[position + i + this.size * j] = square[i][j];
                    
                }
            }
        }

        // Additional white space around each square
        // Top left
        for (let i = 0; i < 9; i++) {        
            this.array[this.coordToIndex(7, i)] = "0";
            this.array[this.coordToIndex(i, 7)] = "0";
            this.array[this.coordToIndex(8, i)] = "0";
            this.array[this.coordToIndex(i, 8)] = "0";
        } 
        this.array[this.coordToIndex(8, 6)] = "1"; // Always here
        this.array[this.coordToIndex(6, 8)] = "1";

        // Top right
        for (let i = 0; i < 8; i++) {        
            this.array[this.coordToIndex(this.size - 8 + i, 7)] = "0";
            this.array[this.coordToIndex(this.size - 8, i)] = "0";
        } 

        // Bottom left
        for (let i = 0; i < 9; i++) {
            this.array[this.coordToIndex(7, this.size - i)] = "0";
            this.array[this.coordToIndex(i, this.size - 8)] = "0";
        } 

        this.array[this.coordToIndex(8, this.size - 8)] = "1";

    }

    addCodewords() {

        // Need to include additional markers for larger versions

        // position initialized to bottom right
        let x_pos, y_pos, goingLeft, goingUp, max_idx;
        let index = 0;

        goingUp = goingLeft = true;

        x_pos = this.size - 1;
        y_pos = this.size - 1;


        // Loop over each bit
        // https://dev.to/maxart2501/let-s-develop-a-qr-code-generator-part-iv-placing-bits-3mn1
        for (let i = 0; i < this.data.length; i++) {

            if (x_pos == 10 && y_pos == this.size - 1) {
                
                this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";
                i++; x_pos--;

                this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";

                x_pos = 8; 
                y_pos = this.size - 9;
                this.array[this.coordToIndex(x_pos, y_pos)] = "X";

                goingUp = true;
                goingLeft = true;

                continue;
            }

            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";           


            if (goingLeft) {

                x_pos--;
                goingLeft = false;
                continue;
            }


            else {

                if (y_pos == 7 && goingUp) {
                    y_pos -= 1;
                }

                else if (y_pos == 5 && !goingUp) {
                    y_pos += 1;
                }

                if (goingUp) {

                    if (y_pos == 0) {
                        goingUp = false;
                        
                        x_pos--;
                        this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0"; 

                        x_pos--; i++;
                        this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";

                        continue;

                    }              

                    else if (x_pos <= 10 || x_pos >= this.size - 8) { // At a finder square boundary
                        
                        if (y_pos == 9) {

                            if (x_pos == 7) {
                                x_pos--;
                            }

                            goingLeft = false;
                            goingUp = false;

                            console.log(x_pos, y_pos);


                            x_pos--;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i+1] == 1 ? "1" : "0";

                            x_pos--; i++;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";


                            console.log(x_pos, y_pos);

                            continue;

                        }

                        else { // Continue going up
                            x_pos++;
                            y_pos--;
                            goingLeft = true;
                            continue;
                        }

                    }

                    else { // Continue going up
                        x_pos++;
                        y_pos--;
                        goingLeft = true;
                        continue;
                    }
                }

                else { // Going down

                    if (y_pos == this.size - 1) {
                        goingUp = true;
                        
                        x_pos--;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";                        
                        

                            x_pos--; i++;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";

                        continue;

                    }              

                    else if (x_pos <= 8) { // At a finder square boundary
                        
                        if (y_pos == this.size - 9) {

                            goingLeft = false;
                            goingUp = true;
                                                        
                            x_pos--;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";

                            x_pos--; i++;
                            this.array[this.coordToIndex(x_pos, y_pos)] = this.data[i] == 1 ? "1" : "0";

                            continue;

                        }

                        else { // Continue going up
                            x_pos++;
                            y_pos++;
                            goingLeft = true;
                            continue;
                        }

                    }

                    else { // Continue going up
                        x_pos++;
                        y_pos++;
                        goingLeft = true;
                        continue;
                    }

                }
            }
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

        let maskedFormatPoly = formatPoly.map(
            (bit, index) => bit ^ FORMAT_MASK[index]
        );

        for (let i = 0; i < 7; i++) {
            let val;
            if (maskedFormatPoly[i] == 254) {
                val = "1";
                // val = "X";
            }
            else if (maskedFormatPoly[i] == 255) {
                val = "0";
                // val = "X";
            }
            else {
                val = maskedFormatPoly[i].toString();
                // val = "X";
            }

            let dx = 0;
            if (i > 5) {dx = 1;}

            this.array[this.coordToIndex(i + dx, 8)] = val; // Top left - bottom
            this.array[this.coordToIndex(8, this.size - i - 1)] = val; // Bottom left - right
            // console.log(i, val);
        }


        for (let i = 7; i < 15; i++) {
            let val;
            if (maskedFormatPoly[i] == 254) {
                val = "1";
                // val = "X";
            }
            else if (maskedFormatPoly[i] == 255) {
                val = "0";
                // val = "X";
            }
            else {
                val = maskedFormatPoly[i].toString();
                // val = "X";
            }

            let dy = 0;
            if (i > 8) {dy = 1;}
            
            this.array[this.coordToIndex(8, 15 - i - dy)] = val; // Top left - right
            this.array[this.coordToIndex(this.size - 15 + i, 8)] = val; // Top right - bottom
            // console.log(i, val);
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