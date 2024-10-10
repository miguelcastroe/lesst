import { clamp, map, mix, smoothstep } from './src/modules/num.js';
import { drawInfo } from './src/modules/drawbox.js';

const settings = { backgroundColor: 'black' };

const { min, max, sin, floor } = Math;

const palette = [
    'black',        // 0 < top
    'purple',       // 1
    'darkred',      // 2
    'red',          // 3
    'orangered',    // 4
    'gold',         // 5
    'lemonchiffon', // 6
    'white'         // 7 < bottom
];

//             top                       bottom
//             v                         v
const flame = '011MMMIIKKKKKEEEEE66667'.split('').map(Number);

const noise = valueNoise();

let cols, rows;

const data = [];

function pre(context, cursor, buffer) {
    if (cols != context.cols || rows != context.rows) {
        cols = context.cols;
        rows = context.rows;
        data.length = cols * rows; 
        data.fill(0);
    }

    if (!cursor.pressed) {
        const t = context.time * 0.0015;
        const last = cols * (rows - 1);
        for (let i = 0; i < cols; i++) {
            const val = floor(map(noise(i * 0.05, t), 0, 1, 5, 50));
            data[last + i] = min(val, data[last + i] + 2);
        }
    } else {
        const cx = floor(cursor.x);
        const cy = floor(cursor.y);
        data[cx + cy * cols] = rndi(5, 50);
    }

    for (let i = 0; i < data.length; i++) {
        const row = floor(i / cols);
        const col = i % cols;
        const dest = row * cols + clamp(col + rndi(-1, 1), 0, cols - 1);
        const src = min(rows - 1, row + 1) * cols + col;
        data[dest] = max(0, data[src] - rndi(0, 2));
    }
}

function main(coord, context, cursor, buffer) {
    const u = data[coord.index];
    const v = flame[clamp(u, 0, flame.length - 1)];

    if (v === 0) return {
        char: ' ',
        backgroundColor: 'black'
    };

    return {
        char: u % 10,
        color: palette[min(palette.length - 1, v + 1)],
        backgroundColor: palette[v]
    };
}

function rndi(a, b = 0) {
    if (a > b) [a, b] = [b, a];
    return Math.floor(a + Math.random() * (b - a + 1));
}

function valueNoise() {
    const tableSize = 256;
    const r = new Array(tableSize);
    const permutationTable = new Array(tableSize * 2);

    for (let k = 0; k < tableSize; k++) {
        r[k] = Math.random();
        permutationTable[k] = k;
    }

    for (let k = 0; k < tableSize; k++) {
        const i = Math.floor(Math.random() * tableSize);
        [permutationTable[k], permutationTable[i]] = [permutationTable[i], permutationTable[k]];
        permutationTable[k + tableSize] = permutationTable[k];
    }

    return function (px, py) {
        const xi = Math.floor(px);
        const yi = Math.floor(py);

        const tx = px - xi;
        const ty = py - yi;

        const rx0 = xi % tableSize;
        const rx1 = (rx0 + 1) % tableSize;
        const ry0 = yi % tableSize;
        const ry1 = (ry0 + 1) % tableSize;

        const c00 = r[permutationTable[permutationTable[rx0] + ry0]];
        const c10 = r[permutationTable[permutationTable[rx1] + ry0]];
        const c01 = r[permutationTable[permutationTable[rx0] + ry1]];
        const c11 = r[permutationTable[permutationTable[rx1] + ry1]];

        const sx = smoothstep(0, 1, tx);
        const sy = smoothstep(0, 1, ty);

        const nx0 = mix(c00, c10, sx);
        const nx1 = mix(c01, c11, sx);

        return mix(nx0, nx1, sy);
    };
}

function post(context, cursor, buffer) {
    drawInfo(context, cursor, buffer);
}
