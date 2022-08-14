/**
 * Controller class for the output canvas
 */
export class CanvasGrid {
    canvasElement: HTMLCanvasElement;
    width: number;
    height: number;
    tileSize: number;

    /**
     * @param canvasId DOM If of the canvas
     * @param size How many cells wide the QR code is
     */
    constructor(canvasId: string, size: number) {
        this.canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

        this.width = size;
        this.height = size;

        this.canvasElement.width = Math.min(
            document.body.clientWidth / 2,
            document.body.clientHeight / 2
        );
        this.canvasElement.height = this.canvasElement.width;

        this.tileSize = this.canvasElement.width / size;
    }

    /**
     * Paint a cell with the given color
     * @param index - Cell index
     * @param color
     */
    fillCell(index: number, color: string) {
        let coords = this._findPosition(index);
        let x = coords[0] * this.tileSize;
        let y = coords[1] * this.tileSize;

        var context = this.canvasElement.getContext('2d');

        context.beginPath();
        context.fillStyle = color;
        context.fillRect(x, y, this.tileSize, this.tileSize);
        context.stroke();
    }

    _findPosition(index: number) {
        let x = index % this.width;
        let y = Math.floor(index / this.width);
        return [x, y];
    }

    _findIndex(x: number, y: number) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return -1;
        }
        return this.width * y + x;
    }
}
