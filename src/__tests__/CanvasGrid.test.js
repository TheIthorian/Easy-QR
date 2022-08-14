import { CanvasGrid } from '../CanvasGrid';

const CANVAS_ID = '#canvasId';
const CANVAS_GRID_SIZE = 10;
const mockContext = { beginPath: jest.fn(), fillRect: jest.fn(), stroke: jest.fn() };
const mockCanvasElement = { getContext: jest.fn().mockReturnValue(mockContext) };

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

    afterEach(() => {
        jest.clearAllMocks();
    });

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
            ${5}  | ${5} | ${0}
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

    describe('fillCell', () => {
        it('correctly fills a cell in the canvas', () => {
            // Given
            const red = '#ff0000';

            // When
            canvasGrid.fillCell(5, red); // Index of 5 is (5, 0)

            // Then
            expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
            expect(mockContext.beginPath).toHaveBeenCalledWith();
            expect(mockContext.fillStyle).toBe(red);
            expect(mockContext.fillRect).toHaveBeenCalledWith(50, 0, 10, 10);
            expect(mockContext.stroke).toHaveBeenCalledWith();
        });
    });

    describe('unFillCell', () => {
        it('correctly sets the cell color to white', () => {
            // Given
            const white = '#000000';

            // When
            canvasGrid.unfillCell(5); // Index of 5 is (5, 0)

            // Then
            expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
            expect(mockContext.beginPath).toHaveBeenCalledWith();
            expect(mockContext.fillStyle).toBe(white);
            expect(mockContext.fillRect).toHaveBeenCalledWith(50, 0, 10, 10);
            expect(mockContext.stroke).toHaveBeenCalledWith();
        });
    });
});
