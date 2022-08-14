/**
 *
 */
export class CanvasGrid {
    canvasElement: HTMLCanvasElement;
    cellColor: string;
    width: number;
    height: number;
    cellArray: Array<string>;
    tileSize: number;

    // canvasId: DOM Id for canvas
    // size: Length in number of cells
    constructor(canvasId: string, size: number) {
        this.canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

        this.cellColor = '#000000';

        this.width = size;
        this.height = size;

        this.cellArray = [];

        this.canvasElement.width = Math.min(
            document.body.clientWidth / 2,
            document.body.clientHeight / 2
        );
        this.canvasElement.height = this.canvasElement.width;

        this.tileSize = this.canvasElement.width / size;

        //this.canvas = new Canvas(canvasElement, Math.ceil(size));
    }

    // Helper funcitons
    findPosition(index: number) {
        let x = index % this.width;
        let y = Math.floor(index / this.width);
        return [x, y];
    }

    findIndex(x: number, y: number) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return -1;
        }
        return this.width * y + x;
    }

    // Drawing functions
    fillCell(n: number, color: string) {
        let coords = this.findPosition(n);
        let x = coords[0] * this.tileSize;
        let y = coords[1] * this.tileSize;

        var context = this.canvasElement.getContext('2d');

        context.beginPath();
        context.fillStyle = color;
        context.fillRect(x, y, this.tileSize, this.tileSize);
        context.stroke();
    }

    unfillCell(n: number) {
        this.fillCell(n, '#000000');
    }
}
