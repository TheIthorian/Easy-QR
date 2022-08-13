import { CanvasGrid } from '../CanvasGrid';

const CANVAS_ID = '#canvasId';
const CANVAS_GRID_SIZE = 10;
const mockCanvasElement = {};

jest.spyOn(document, 'getElementById').mockReturnValue(mockCanvasElement);

describe('constructor', () => {
    // Given // When
    jest.spyOn(Math, 'min').mockReturnValue(100);
    const canvasGrid = new CanvasGrid(CANVAS_ID, CANVAS_GRID_SIZE);

    const { canvasElement, cellColor, width, height, cellArray, tileSize } = canvasGrid;

    // Then
    expect(document.getElementById).toHaveBeenCalledWith(CANVAS_ID);
    expect(canvasElement).toBe(mockCanvasElement);
    expect(cellColor).toBe('#000000');
    expect(width).toBe(CANVAS_GRID_SIZE);
    expect(height).toBe(CANVAS_GRID_SIZE);
    expect(cellArray).toStrictEqual([]);
    expect(canvasElement.width).toBe(100);
    expect(canvasElement.height).toBe(100);
    expect(tileSize).toBe(10);
});

describe('CanvasGrid', () => {
    const canvasGrid = new CanvasGrid(CANVAS_ID, CANVAS_GRID_SIZE);

    describe('findPosition', () => {
        it.each`
            index | x    | y
            ${0}  | ${0} | ${0}
            ${9}  | ${9} | ${0}
            ${10} | ${0} | ${1}
            ${99} | ${9} | ${9}
        `(
            `Returns the correct coordinates ($x, $y) given an index of $index`,
            ({ index, x, y }) => {
                // Given / When
                const [rX, rY] = canvasGrid.findPosition(index);

                // Then
                expect(rX).toBe(x);
                expect(rY).toBe(y);
            }
        );
    });

    describe('findIndex', () => {
        it.each`
            index | x    | y
            ${0}  | ${0} | ${0}
            ${9}  | ${9} | ${0}
            ${10} | ${0} | ${1}
            ${99} | ${9} | ${9}
        `(
            `Returns the correct index of $index, given the coordinates ($x, $y)`,
            ({ index, x, y }) => {
                // Given / When
                const rIndex = canvasGrid.findIndex(x, y);

                // Then
                expect(rIndex).toBe(index);
            }
        );

        it('returns -1 when the x coordinate is less than 0', () => {
            // Given / When
            const index = canvasGrid.findIndex(-1, 0);

            // Then
            expect(index).toBe(-1);
        });

        it('returns -1 when the y coordinate is less than 0', () => {
            // Given / When
            const index = canvasGrid.findIndex(0, -1);

            // Then
            expect(index).toBe(-1);
        });

        it('returns -1 when the x coordinate is greater than the width', () => {
            // Given / When
            const index = canvasGrid.findIndex(11, 0);

            // Then
            expect(index).toBe(-1);
        });

        it('returns -1 when the y coordinate is greater than the width', () => {
            // Given / When
            const index = canvasGrid.findIndex(0, 11);

            // Then
            expect(index).toBe(-1);
        });
    });
});
