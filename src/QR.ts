import { QRCode } from './QRCode';

/**
 * Controller class to generate and display QR codes.
 */
export class QR {
    qrCode: QRCode;

    constructor(
        canvasId: string,
        data: string,
        mode: string = 'Byte',
        correctionLevel: string = 'L'
    ) {
        this.qrCode = new QRCode(canvasId, data, mode, correctionLevel);
    }

    getCanvasId() {
        return this.qrCode.canvasId;
    }

    setCanvasId(canvasId: string) {
        this.qrCode.canvasId = canvasId;
        return this.qrCode.canvasId;
    }

    getMode() {
        return this.qrCode.mode;
    }

    // setMode(mode) {
    //     if (!MODES[mode]) {
    //         throw 'Invalid mode';
    //     } else {
    //         this.qrCode.mode = mode;
    //         return this.qrCode.mode;
    //     }
    // }

    getCorrectionLevel() {
        return this.qrCode.correctionLevel;
    }

    // setCorrectionLevel(correctionLevel) {
    //     if (!CORRECTION_LEVELS[correctionLevel]) {
    //         throw 'Invalid correction level';
    //     } else {
    //         this.qrCode.correctionLevel = correctionLevel;
    //         return this.qrCode.correctionLevel;
    //     }
    // }

    getVersion() {
        return this.qrCode.version;
    }

    getSize() {
        return this.qrCode.size;
    }

    getCode() {
        return this.qrCode.generateCode();
    }

    // getModeRegex(mode) {
    //     if (!MODES[mode]) {
    //         throw 'Invalid mode';
    //     } else {
    //         return MODE_REGEX[mode];
    //     }
    // }

    printCodeToCanvas(canvasId: string) {
        // if (canvasId) {
        //     this.qrCode.setCanvasId(canvasId);
        // }
        this.qrCode.display();
    }
}
