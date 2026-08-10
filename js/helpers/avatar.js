function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

export function renderAvatar(canvas, seed) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const grid = 5;
    const cell = size / grid;
    const hash = hashString(String(seed || 'user'));
    const hue = Math.abs(hash) % 360;
    const fg = `hsl(${hue}, 70%, 55%)`;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fg;

    const half = Math.ceil(grid / 2);
    let bitIndex = 0;
    for (let x = 0; x < half; x++) {
        for (let y = 0; y < grid; y++) {
            const bit = (hash >> (bitIndex % 30)) & 1;
            bitIndex++;
            if (!bit) continue;
            ctx.fillRect(x * cell, y * cell, cell, cell);
            const mirrorX = grid - 1 - x;
            if (mirrorX !== x) {
                ctx.fillRect(mirrorX * cell, y * cell, cell, cell);
            }
        }
    }
}
