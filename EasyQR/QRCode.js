const correctionLevels = {
    'L': 0.07,
    'M': 0.15,
    'Q': 0.25,
    'H': 0.30,
};
//https://www.thonky.com/qr-code-tutorial/error-correction-table


const modes = {
    'Numeric': '0001',
    'Alphanumeric': '0010',
    'Byte': '0100',
    'Kanji': '1000',
    'ECI': '0111'
};


const characterLengthMap = {
    'Numeric': function (version) {
        if (version < 10) { return 10; }
        else if (version < 17) { return 12; }
        else { return 14; }
    },
    'Alphanumeric': function (version) {
        if (version < 10) { return 9; }
        else if (version < 17) { return 11; }
        else { return 13; }
    },
    'Byte': function (version) {
        if (version < 10) { return 8; }
        else if (version < 17) { return 16; }
        else { return 16; }
    },
    'Kanji': function (version) {
        if (version < 10) { return 8; }
        else if (version < 17) { return 10; }
        else { return 12; }
    },
    'ECI': function (version) { return 0; }
}

// Old data structure for character limits:
/*
const characterLimitMap = {
    'L': {
        'Numeric':      [41,77,127,187,255,322,370,461,552,652,772,883,1022,1101,1250,1408,1548,1725,1903,2061,2232,2409,2620,2812,3057,3283,3517,3669,3909,4158,4417,4686,4965,5253,5529,5836,6153,6479,6743,7089],
        'Alphanumeric': [25,47,77,114,154,195,224,279,335,395,468,535,619,667,758,854,938,1046,1153,1249,1352,1460,1588,1704,1853,1990,2132,2223,2369,2520,2677,2840,3009,3183,3351,3537,3729,3927,4087,4296],
        'Byte':         [17,32,53,78,106,134,154,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953],
        'Kanji':        [10,20,32,48,65,82,95,118,141,167,198,226,262,282,320,361,397,442,488,528,572,618,672,721,784,842,902,940,1002,1066,1132,1201,1273,1347,1417,1496,1577,1661,1729,1817],
        'ECI':          [0],
    },
    'M': {
        'Numeric':      [34,63,101,149,202,255,293,365,432,513,604,691,796,871,991,1082,1212,1346,1500,1600,1708,1872,2059,2188,2395,2544,2701,2857,3035,3289,3486,3693,3909,4134,4343,4588,4775,5039,5313,5596],
        'Alphanumeric': [20,38,61,90,122,154,178,221,262,311,366,419,483,528,600,656,734,816,909,970,1035,1134,1248,1326,1451,1542,1637,1732,1839,1994,2113,2238,2369,2506,2632,2780,2894,3054,3220,3391],
        'Byte':         [14,26,42,62,84,106,122,152,180,213,251,287,331,362,412,450,504,560,624,666,711,779,857,911,997,1059,1125,1190,1264,1370,1452,1538,1628,1722,1809,1911,1989,2099,2213,2331],
        'Kanji':        [8,16,26,38,52,65,75,93,111,131,155,177,204,223,254,277,310,345,384,410,438,480,528,561,614,652,692,732,778,843,894,947,1002,1060,1113,1176,1224,1292,1362,1435],
        'ECI':          [0],
    },
    'Q': {
        'Numeric':      [27,48,77,111,144,178,207,259,312,364,427,489,580,621,703,775,876,948,1063,1159,1224,1358,1468,1588,1718,1804,1933,2085,2181,2358,2473,2670,2805,2949,3081,3244,3417,3599,3791,3993],
        'Alphanumeric': [16,29,47,67,87,108,125,157,189,221,259,296,352,376,426,470,531,574,644,702,742,823,890,963,1041,1094,1172,1263,1322,1429,1499,1618,1700,1787,1867,1966,2071,2181,2298,2420],
        'Byte':         [11,20,32,46,60,74,86,108,130,151,177,203,241,258,292,322,364,394,442,482,509,565,611,661,715,751,805,868,908,982,1030,1112,1168,1228,1283,1351,1423,1499,1579,1663],
        'Kanji':        [7,12,20,28,37,45,53,66,80,93,109,125,149,159,180,198,224,243,272,297,314,348,376,407,440,462,496,534,559,604,634,684,719,756,790,832,876,923,972,1024],
        'ECI':          [0],
    },
    'H': {
        'Numeric':      [17,34,58,82,106,139,154,202,235,288,331,374,427,468,530,602,674,746,813,919,969,1056,1108,1228,1286,1425,1501,1581,1677,1782,1897,2022,2157,2301,2361,2524,2625,2735,2927,3057],
        'Alphanumeric': [10,20,35,50,64,84,93,122,143,174,200,227,259,283,321,365,408,452,493,557,587,640,672,744,779,864,910,958,1016,1080,1150,1226,1307,1394,1431,1530,1591,1658,1774,1852],
        'Byte':         [7,14,24,34,44,58,64,84,98,119,137,155,177,194,220,250,280,310,338,382,403,439,461,511,535,593,625,658,698,742,790,842,898,958,983,1051,1093,1139,1219,1273],
        'Kanji':        [4,8,15,21,27,36,39,52,60,74,85,96,109,120,136,154,173,191,208,235,248,270,284,315,330,365,385,405,430,457,486,518,553,590,605,647,673,701,750,784],
        'ECI':          [0],
    }
};
*/

// Depending on the correction level (L,M,Q,H) or the mode (Numeric, Alphanumeric, Byte, Kanji, ECI), there is a limit to the number of characters that can fit on each of the 40 QR code sizes
// This structure hold data for each of the QR code sizes, depending on the correction level and mode.

/*  totalDataCodewords:     Number of code words
    ECCodeWordsPerBlock:    Number EC codewords per block
    blocksInGroup1:         Number of blocks in group 1
    codewordsInGroup1Block: Number of codewords in a group 1 block
    blocksInGroup2:         Number of blocks in group 2
    codewordsInGroup2Block: Number of codewords in a group 2 block
    modeSize:               The maximum number of characters
*/

const versionData = {
    'L': {
        totalDataCodewords: [19, 34, 55, 80, 108, 136, 156, 194, 232, 274, 324, 370, 428, 461, 523, 589, 647, 721, 795, 861, 932, 1006, 1094, 1174, 1276, 1370, 1468, 1531, 1631, 1735, 1843, 1955, 2071, 2191, 2306, 2434, 2566, 2702, 2812, 2956, 1276],
        ECCodeWordsPerBlock: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        blocksInGroup1: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4, 2, 4, 3, 5, 5, 1, 5, 3, 3, 4, 2, 4, 6, 8, 10, 8, 3, 7, 5, 13, 17, 17, 13, 12, 6, 17, 4, 20, 19, 20],
        codewordsInGroup1Block: [19, 34, 55, 80, 108, 68, 78, 97, 116, 68, 81, 92, 107, 115, 87, 98, 107, 120, 113, 107, 116, 111, 121, 117, 106, 114, 122, 117, 116, 115, 115, 115, 115, 115, 121, 121, 122, 122, 117, 118, 15],
        blocksInGroup2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 1, 1, 1, 5, 1, 4, 5, 4, 7, 5, 4, 4, 2, 4, 10, 7, 10, 3, 0, 1, 6, 7, 14, 4, 18, 4, 6, 61],
        codewordsInGroup2Block: [0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 93, 0, 116, 88, 99, 108, 121, 114, 108, 117, 112, 122, 118, 107, 115, 123, 118, 117, 116, 116, 0, 116, 116, 122, 122, 123, 123, 118, 119, 16],
        modeSize: { // Max number of characters per version, starting at version=1
            'Numeric': [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479, 6743, 7089],
            'Alphanumeric': [25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758, 854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132, 2223, 2369, 2520, 2677, 2840, 3009, 3183, 3351, 3537, 3729, 3927, 4087, 4296],
            'Byte': [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953],
            'Kanji': [10, 20, 32, 48, 65, 82, 95, 118, 141, 167, 198, 226, 262, 282, 320, 361, 397, 442, 488, 528, 572, 618, 672, 721, 784, 842, 902, 940, 1002, 1066, 1132, 1201, 1273, 1347, 1417, 1496, 1577, 1661, 1729, 1817],
            'ECI': [0],
        }
    },
    'M': {
        totalDataCodewords: [16, 28, 44, 64, 86, 108, 124, 154, 182, 216, 254, 290, 334, 365, 415, 453, 507, 563, 627, 669, 714, 782, 860, 914, 1000, 1062, 1128, 1193, 1267, 1373, 1455, 1541, 1631, 1725, 1812, 1914, 1992, 2102, 2216, 2334],
        ECCodeWordsPerBlock: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
        blocksInGroup1: [1, 1, 1, 2, 2, 4, 4, 2, 3, 4, 1, 6, 8, 4, 5, 7, 10, 9, 3, 3, 17, 17, 4, 6, 8, 19, 22, 3, 21, 19, 2, 10, 14, 14, 12, 6, 29, 13, 40, 18],
        codewordsInGroup1Block: [16, 28, 44, 32, 43, 27, 31, 38, 36, 43, 50, 36, 37, 40, 41, 45, 46, 43, 44, 41, 42, 46, 47, 45, 47, 46, 45, 45, 45, 47, 46, 46, 46, 46, 47, 47, 46, 46, 47, 47],
        blocksInGroup2: [0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 4, 2, 1, 5, 5, 3, 1, 4, 11, 13, 0, 0, 14, 14, 13, 4, 3, 23, 7, 10, 29, 23, 21, 23, 26, 34, 14, 32, 7, 31],
        codewordsInGroup2Block: [0, 0, 0, 0, 0, 0, 0, 39, 37, 44, 51, 37, 38, 41, 42, 46, 47, 44, 45, 42, 0, 0, 48, 46, 48, 47, 46, 46, 46, 48, 47, 47, 47, 47, 48, 48, 47, 47, 48, 48],
        modeSize: {
            'Numeric': [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596],
            'Alphanumeric': [20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600, 656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391],
            'Byte': [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331],
            'Kanji': [8, 16, 26, 38, 52, 65, 75, 93, 111, 131, 155, 177, 204, 223, 254, 277, 310, 345, 384, 410, 438, 480, 528, 561, 614, 652, 692, 732, 778, 843, 894, 947, 1002, 1060, 1113, 1176, 1224, 1292, 1362, 1435],
            'ECI': [0],
        }
    },
    'Q': {
        totalDataCodewords: [13, 22, 34, 48, 62, 76, 88, 110, 132, 154, 180, 206, 244, 261, 295, 325, 367, 397, 445, 485, 512, 568, 614, 664, 718, 754, 808, 871, 911, 985, 1033, 1115, 1171, 1231, 1286, 1354, 1426, 1502, 1582, 1666],
        ECCodeWordsPerBlock: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        blocksInGroup1: [1, 1, 2, 2, 2, 4, 2, 4, 4, 6, 4, 4, 8, 11, 5, 15, 1, 17, 17, 15, 17, 7, 11, 11, 7, 28, 8, 4, 1, 15, 42, 10, 29, 44, 39, 46, 49, 48, 43, 34],
        codewordsInGroup1Block: [13, 22, 17, 24, 15, 19, 14, 18, 16, 19, 22, 20, 20, 16, 24, 19, 22, 22, 21, 24, 22, 24, 24, 24, 24, 22, 23, 24, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
        blocksInGroup2: [0, 0, 0, 0, 2, 0, 4, 2, 4, 2, 4, 6, 4, 5, 7, 2, 15, 1, 4, 5, 6, 16, 14, 16, 22, 6, 26, 31, 37, 25, 1, 35, 19, 7, 14, 10, 10, 14, 22, 34],
        codewordsInGroup2Block: [0, 0, 0, 0, 16, 0, 15, 19, 17, 20, 23, 21, 21, 17, 25, 20, 23, 23, 22, 25, 23, 25, 25, 25, 25, 23, 24, 25, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        modeSize: {
            'Numeric': [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993],
            'Alphanumeric': [16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470, 531, 574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322, 1429, 1499, 1618, 1700, 1787, 1867, 1966, 2071, 2181, 2298, 2420],
            'Byte': [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663],
            'Kanji': [7, 12, 20, 28, 37, 45, 53, 66, 80, 93, 109, 125, 149, 159, 180, 198, 224, 243, 272, 297, 314, 348, 376, 407, 440, 462, 496, 534, 559, 604, 634, 684, 719, 756, 790, 832, 876, 923, 972, 1024],
            'ECI': [0],
        }
    },
    'H': {
        totalDataCodewords: [9, 16, 26, 36, 46, 60, 66, 86, 100, 122, 140, 158, 180, 197, 223, 253, 283, 313, 341, 385, 406, 442, 464, 514, 538, 596, 628, 661, 701, 745, 793, 845, 901, 961, 986, 1054, 1096, 1142, 1222, 1276],
        ECCodeWordsPerBlock: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        blocksInGroup1: [1, 1, 2, 4, 2, 4, 4, 4, 4, 6, 3, 7, 12, 11, 11, 3, 2, 2, 9, 15, 19, 34, 16, 30, 22, 33, 12, 11, 19, 23, 23, 19, 11, 59, 22, 2, 24, 42, 10, 20],
        codewordsInGroup1Block: [9, 16, 13, 9, 11, 15, 13, 14, 12, 15, 12, 14, 11, 12, 12, 15, 14, 14, 13, 15, 16, 13, 15, 16, 15, 16, 15, 15, 15, 15, 15, 15, 15, 16, 15, 15, 15, 15, 15, 15],
        blocksInGroup2: [0, 0, 0, 0, 2, 0, 1, 2, 4, 2, 8, 4, 4, 5, 7, 13, 17, 19, 16, 10, 6, 0, 14, 2, 13, 4, 28, 31, 26, 25, 28, 35, 46, 1, 41, 64, 46, 32, 67, 61],
        codewordsInGroup2Block: [0, 0, 0, 0, 12, 0, 14, 15, 13, 16, 13, 15, 12, 13, 13, 16, 15, 15, 14, 16, 17, 0, 16, 17, 16, 17, 16, 16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16],
        modeSize: {
            'Numeric': [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524, 2625, 2735, 2927, 3057],
            'Alphanumeric': [10, 20, 35, 50, 64, 84, 93, 122, 143, 174, 200, 227, 259, 283, 321, 365, 408, 452, 493, 557, 587, 640, 672, 744, 779, 864, 910, 958, 1016, 1080, 1150, 1226, 1307, 1394, 1431, 1530, 1591, 1658, 1774, 1852],
            'Byte': [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273],
            'Kanji': [4, 8, 15, 21, 27, 36, 39, 52, 60, 74, 85, 96, 109, 120, 136, 154, 173, 191, 208, 235, 248, 270, 284, 315, 330, 365, 385, 405, 430, 457, 486, 518, 553, 590, 605, 647, 673, 701, 750, 784],
            'ECI': [0],
        }
    }
};

const DATA_LOG = {

}

class QRCode {

    constructor(canvasId, data, mode = 'Byte', correctionLevel = 'L') {

        this.canvasId = canvasId;  // The HTML canvas's ID to draw the results :: String
        this.data = data;          // Data to be encoded :: String
        this.mode = mode;          // The type of encoding - depends on which characters are allowed :: String
        this.correctionLevel = correctionLevel; 

        this.version = this.getRequiredVersion();

        // If the data is too long, set size to 0
        if (this.version < 0) {
            this.size = 0;
        }
        else { this.size = (21 - 4) + (4 * this.version); }        

        DATA_LOG['Properties'] = {
                "Size": this.size,
                "Version": this.version,
                "Correction Level":this.correctionLevel
        };

        console.log('DATA_LOG', DATA_LOG);

        this.canvasGrid = new CanvasGrid(this.canvasId, this.size);
    }


    // Returns the QR code version number
    // Returns -1 when data is invalid
    getRequiredVersion() {

        if (this.data.length > 7089) {
            console.log("getRequiredVersion(): Text too large");
            return -1
        }

        let lengths = versionData[this.correctionLevel].modeSize[this.mode];

        for (let i = 0; i < lengths.length; i++) {
            if (lengths[i] > this.data.length) {
                return i + 1;
            }
        }
        console.log("getRequiredVersion(): Invalid parameters");

        return -1;
    }


    // Takes a character, in binary, and returns a padded string depending on the mode and version
    padCharacterLength(bCharacter) {

        let characterLength = characterLengthMap[this.mode](this.version);

        while (bCharacter.length % characterLength != 0) {
            bCharacter = '0' + bCharacter;
        }

        return bCharacter;
    }


    // Check if the data conforms to the limits of the encoding type
    validateData(data) {

        const NUMERIC_RE = /^\d*$/;
        const ALPHANUMERIC_RE = /^[\dA-Z $%*+\-./:]*$/;
        const BYTE_RE = /^[\x00-\xff]*$/;
        const KANJI_RE = /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u;


        // Numeric only allows numbers
        if (this.mode == 'Numeric') {
            if (NUMERIC_RE.test(data)) {
                return [false, 'Numeric mode may only contain digits'];
            }
            else { return [true, null]; }            
        }

        else if (this.mode == 'Alphanumeric') {
            if (ALPHANUMERIC_RE.test(data)) {
                return [false, 'Alphanumeric mode may only contain digits and upper-case letters'];
            }
            else { return [true, null]; }  
        }

        else if (this.mode == 'Byte') {
            if (BYTE_RE.test(data)) {
                return [false, 'Some characters not allowed in Byte mode'];
            }
            else { return [true, null]; }        
        }

        else if (this.mode == 'Kanji') {
            if (KANJI_RE.test(data)) {
                return [false, 'Some characters not allowed in Kanji mode'];
            }
            else { return [true, null]; }        
        }


    }


    /* Take the data and output a binary string formed of the following:
     - 4 bits of the mode
     - Length of the data
     - Binary representation of the data
     - Terminator to mark the end of the attributes
     - Padding
    */
    getCodeWords() {

        let output = "";

        // The number of characters to be encoded as an 8 bit binary string
        let bDataLength = this.data.length.toString(2);
        bDataLength = this.padCharacterLength(bDataLength);

        // The encoding mode as a 4 bit binary string
        let bMode = modes[this.mode];

        // Used to round the total number of encoding bits to 8
        let bTerminator = "";

        // Add the mode and data length bits to the output
        output += bMode + bDataLength;

        // Logging
        log({
            'bMode': bMode, 
            'bDataLength': bDataLength,
            'bData': ''
        });
        printLog();


        // Add the data. How many bits per codeword depends on the mode
        
        if (this.mode == 'Byte') { // https://www.thonky.com/qr-code-tutorial/byte-mode-encoding

            // Turn each character into binary and add it to the output
            for (let i = 0; i < this.data.length; i++) {
                let bChar = this.padCharacterLength(toBinary(this.data[i]));
                output += bChar;
                DATA_LOG['bData'] += bChar;
                console.log(this.data[i],': ', bChar);
            }
        }

        else if (this.mode == 'Numeric') {
            //https://www.thonky.com/qr-code-tutorial/numeric-mode-encoding
            //https://www.thonky.com/qr-code-tutorial/byte-mode-encoding
            //https://www.thonky.com/qr-code-tutorial/kanji-mode-encoding
        }

        else if (this.mode = 'AlphaNumeric') { }



        // If the total bits is more than the number of bits used, add a terminator, up to 4 bits long
        let totalBits = this.getTotalCodewords() * characterLengthMap[this.mode](this.version);
        this.totalBits = totalBits;

        for (let i = 0; i < Math.min(totalBits - output.length, 4); i++) { bTerminator += '0' };
        output += bTerminator;
        

        log({
            'bTerminator': bTerminator,
            'totalBits': totalBits
        })
        printLog();



        // Pad the end of the output until the total number of bits is a multiple of 8
        while (output.length % 8 != 0) {
            output += '0';
        }


        // If the output is still not long enough, add the following until it is:
        let toggle = true;
        while (output.length < totalBits) {
            if (toggle) {
                output += '11101100';
            }
            else {
                output += '00010001';
            }
            toggle = !toggle;
        }

        return output;

    }

    // Returns the encoded data as a string of binary
    generateCode() {  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw

        let output = this.getCodeWords();
        console.log(output);

        // Error correction code words:
        // https://www.thonky.com/qr-code-tutorial/error-correction-coding

        // Break up the data into codewords
        let numberofCodeWords = this.getTotalCodewords();
        // let characterLength = characterLengthMap[this.mode](this.version);

        log({'numberofCodeWords': numberofCodeWords});


        this.group1 = [];
        this.group2 = [];
        let index = 0;

        // For each block in group 1
        for (let i = 0; i < versionData[this.correctionLevel].blocksInGroup1[this.version - 1]; i++) {

            this.group1.push([]);

            // For each codeword in block
            for (let j = 0; j < versionData[this.correctionLevel].codewordsInGroup1Block[this.version - 1]; j++) {
                // Add the codewrpd to the block
                this.group1[i].push(output.slice(index * 8, (index + 1) * 8));
                index += 1;
            }
        }

        // Do the same for group 2 if required
        if (versionData[this.correctionLevel].blocksInGroup2[this.version - 1]) {
            for (let i = 0; i < versionData[this.correctionLevel].blocksInGroup2[this.version - 1]; i++) {

                this.group2.push([]);

                // For each codeword in block
                for (let j = 0; j < versionData[this.correctionLevel].codewordsInGroup2Block[this.version - 1]; j++) {
                    // Add the codewrpd to the block
                    this.group2[i].push(output.slice(index * 8, (index + 1) * 8));
                    index += 1;
                }
            }
        }

        // Add groups to log
        log({
            'Group 1': this.group1,
            'Group 2': this.group2
        });

        // Show each codeword value
        for (let i = 0; i < this.group1[0].length; i++) {
            // console.log(i, this.group1[0][i], binaryToHex(this.group1[0][i]));
        }



        // Reed-Solomon Error correction
        //https://downloads.bbc.co.uk/rd/pubs/whp/whp-pdf-files/WHP031.pdf
        //https://www.thonky.com/qr-code-tutorial/how-create-generator-polynomial
        //https://www.thonky.com/qr-code-tutorial/error-correction-coding

        // 1. Convert the codewords into base10
        
        let group1Coefficients = [];
        let group2Coefficients = [];
        let numberOfErrorCorrectionCodeWords = versionData[this.correctionLevel].ECCodeWordsPerBlock[this.version - 1];

        for (let i = 0; i < this.group1.length; i++) {
            for (let j = 0; j < this.group1[i].length; j++)
                group1Coefficients.push(parseInt(this.group1[i][j], 2));
        }

        for (let i = 0; i < this.group2.length; i++) {
            for (let j = 0; j < this.group2[i].length; j++)
                group2Coefficients.push(parseInt(this.group2[i][j], 2));
        }

        log({ 
            'numberOfErrorCorrectionCodeWords': numberOfErrorCorrectionCodeWords,
            'group1Coefficients': group1Coefficients,
            'group2Coefficients': group2Coefficients
        });


        //https://dev.to/maxart2501/let-s-develop-a-qr-code-generator-part-ii-sequencing-data-4ae
        // 2. Get error correction codewords
        let ECC = getEDC(group1Coefficients, numberOfErrorCorrectionCodeWords + numberofCodeWords);

        for (let i = 0; i < ECC.length; i++) {
            // console.log(i, ECC[i], intToHex(ECC[i]), this.padCharacterLength(parseInt(ECC[i], 10).toString(2)));
            output += this.padCharacterLength(parseInt(ECC[i], 10).toString(2));
        }

        log({
            'ECC': ECC,
            'output': output
        });
        printLog();
        
        let qr = new QRArray(this.size, output, this.correctionLevel);
        qr.addCodewords();
        qr.applyMasks();
        qr.addTimingPattern();
        qr.addFinderPattern();
        qr.addFormatBits();
        qr.addErrorLevel();
        

        //console.log("Output: ", output);
        return qr.array;
    }


    // Need to look here to find them: 
    // https://www.thonky.com/qr-code-tutorial/error-correction-table
    getTotalCodewords() {
        let blocksInGroup1 = versionData[this.correctionLevel].blocksInGroup1[this.version - 1]; // Index 0 is version 1 data
        let codewordsInGroup1Block = versionData[this.correctionLevel].codewordsInGroup1Block[this.version - 1];
        let blocksInGroup2 = versionData[this.correctionLevel].blocksInGroup2[this.version - 1];
        let codewordsInGroup2Block = versionData[this.correctionLevel].codewordsInGroup2Block[this.version - 1];

        return blocksInGroup1 * codewordsInGroup1Block + blocksInGroup2 * codewordsInGroup2Block;
    }
    


    // Displays the QR code on the canvas
    display() {

        let output = this.generateCode();
        console.log(output);

        for (let i = 0; i < output.length; i++) {
            setTimeout(() => {
                if (output[i] === "X") {
                    this.canvasGrid.fillCell(i, '#FF0000');
                }
                else if (output[i] === "1") {
                    this.canvasGrid.fillCell(i, '#000000');
                }
                else if (output[i] === "0") {
                    this.canvasGrid.fillCell(i, '#FFFFFF');
                }
              }, i * 0);
        }
        return output;
    }


    // Logs all data of the instance
    log() {
        console.log(this);
    }

}


// Helper functions

// Returns the character limit for the mode and correctionLevel
function getCharacterLimit(mode, correctionLevel) {
    return Math.max(versionData[correctionLevel].modeSize[mode]);
}


// Converts a string to binary
function toBinary(sInput) {
    sInput = sInput.toString();

    var output = ""
    for (var i = 0; i < sInput.length; i++) {
        output += sInput[i].charCodeAt(0).toString(2);
    }

    //console.log("toBindary(): " + sInput + " > " + output);

    return output;
}


function binaryToHex(sBinary) {
    return parseInt(sBinary, 2).toString(16);
}

function intToHex(iInt) {
    return parseInt(iInt, 10).toString(16);
}

// Adds data to the global log
function log(dict) {
    for (key of Object.keys(dict)) {
        DATA_LOG[key] = dict[key];
    }
}

// Prints the log
function printLog() {
    console.log('DATA_LOG: ', DATA_LOG);
}


const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);
for (let exponent = 1, value = 1; exponent < 256; exponent++) {
    value = value > 127 ? ((value << 1) ^ 285) : value << 1;
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
    // This is going to be the product polynomial, that we pre-allocate.
    // We know it's going to be `poly1.length + poly2.length - 1` long.
    const coeffs = new Uint8Array(poly1.length + poly2.length - 1);

    // Instead of executing all the steps in the example, we can jump to
    // computing the coefficients of the result
    for (let index = 0; index < coeffs.length; index++) {
        let coeff = 0;
        for (let p1index = 0; p1index <= index; p1index++) {
            const p2index = index - p1index;
            // We *should* do better here, as `p1index` and `p2index` could
            // be out of range, but `mul` defined above will handle that case.
            // Just beware of that when implementing in other languages.
            coeff ^= mul(poly1[p1index], poly2[p2index]);
        }
        coeffs[index] = coeff;
    }
    return coeffs;
}

function polyRest(dividend, divisor) {
    console.log("dividend, divisor: ", divisor);

    const quotientLength = dividend.length - divisor.length + 1;
    // Let's just say that the dividend is the rest right away
    let rest = new Uint8Array(dividend);
    for (let count = 0; count < quotientLength; count++) {
        // If the first term is 0, we can just skip this iteration
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

function getGeneratorPoly(degree) {
    let lastPoly = new Uint8Array([1]);
    for (let index = 0; index < degree; index++) {
        lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[index]]));
    }
    return lastPoly;
}

function getEDC(data, codewords) {
    const degree = codewords - data.length;
    const messagePoly = new Uint8Array(codewords);
    messagePoly.set(data, 0);
    return polyRest(messagePoly, getGeneratorPoly(degree));
}