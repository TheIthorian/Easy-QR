import * as Util from '../util';

describe('toBinary', () => {
    it('returns an empty string when the input is empty', () => {
        expect(Util.toBinary('')).toBe('');
    });

    it.each`
        input                 | outputString
        ${'0'}                | ${'110000'}
        ${'A'}                | ${'1000001'}
        ${'10'}               | ${'110001110000'}
        ${'This is a string'} | ${'01010100011010000110100101110011001000000110100101110011001000000110000100100000011100110111010001110010011010010110111001100111'}
    `(
        'returns a string of binary [$outputString] given an input string [$input]',
        ({ input, outputString }) => {
            expect(Util.toBinary(input)).toBe(outputString);
        }
    );
});
