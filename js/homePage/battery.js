const batteryDiv = document.querySelector('.battery');


let batteryInterval = null;

function drawBlock(block, colors, children, startRow, startCol, batteryWidth) {
    for (let r = 0; r < colors.length; r++) {
        for (let c = 0; c < colors[r].length; c++) {
            const col = startCol + block * colors[r].length + c;
            const index = (startRow + r) * batteryWidth + col;
            children[index].style.backgroundColor = colors[r][c];
        }
    }
}

function clearBlock(block, children, startRow, startCol, batteryWidth) {
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 6; c++) {
            const col = startCol + block * 6 + c;
            const index = (startRow + r) * batteryWidth + col;
            children[index].style.backgroundColor = "";
        }
    }
}


export function makeBattery() {
    const batteryPixels =
        [
            ['', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '', '', ''],
            ['#000000', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#000000', '', ''],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '', ''],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#000000', ''],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#ffffff', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#ffffff', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#ffffff', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#ffffff', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#252525', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#252525', '#000000'],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '#000000', ''],
            ['#000000', '#9fb6c4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '#9fb6c4', '#000000', '', ''],
            ['#000000', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#9fb6c4', '#000000', '', ''],
            ['', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '', '', '']
        ];

    for (const row of batteryPixels) {
        for (const pixel of row) {
            const div = document.createElement("div");
            div.textContent = '.'
            if (pixel) {
                div.style.backgroundColor = pixel;
            } else {
                div.style.backgroundColor = "transparent";
            }

            batteryDiv.appendChild(div);
        }
    }
}



export function fillBattery(ratio = 0) {

    const children = batteryDiv.children;

    const green = [
        ['#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21'],
        ['#2d4e21', '#72b043', '#72b043', '#72b043', '#72b043', '#2d4e21'],
        ['#2d4e21', '#72b043', '#72b043', '#72b043', '#72b043', '#2d4e21'],
        ['#2d4e21', '#98cb55', '#98cb55', '#98cb55', '#98cb55', '#2d4e21'],
        ['#2d4e21', '#98cb55', '#98cb55', '#98cb55', '#98cb55', '#2d4e21'],
        ['#2d4e21', '#98cb55', '#98cb55', '#98cb55', '#98cb55', '#2d4e21'],
        ['#2d4e21', '#6fb143', '#6fb143', '#6fb143', '#6fb143', '#2d4e21'],
        ['#2d4e21', '#6fb143', '#6fb143', '#6fb143', '#6fb143', '#2d4e21'],
        ['#2d4e21', '#649a46', '#649a46', '#649a46', '#649a46', '#2d4e21'],
        ['#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21', '#2d4e21'],
    ];

    const yellow = [
        ['#4e4821', '#4e4821', '#4e4821', '#4e4821', '#4e4821', '#4e4821'],
        ['#4e4821', '#b0a343', '#b0a343', '#b0a343', '#b0a343', '#4e4821'],
        ['#4e4821', '#b0a343', '#b0a343', '#b0a343', '#b0a343', '#4e4821'],
        ['#4e4821', '#cbc055', '#cbc055', '#cbc055', '#cbc055', '#4e4821'],
        ['#4e4821', '#cbc055', '#cbc055', '#cbc055', '#cbc055', '#4e4821'],
        ['#4e4821', '#cbc055', '#cbc055', '#cbc055', '#cbc055', '#4e4821'],
        ['#4e4821', '#b1a343', '#b1a343', '#b1a343', '#b1a343', '#4e4821'],
        ['#4e4821', '#b1a343', '#b1a343', '#b1a343', '#b1a343', '#4e4821'],
        ['#4e4821', '#9a8f46', '#9a8f46', '#9a8f46', '#9a8f46', '#4e4821'],
        ['#4e4821', '#4e4821', '#4e4821', '#4e4821', '#4e4821', '#4e4821'],
    ];

    const red = [
        ['#4e2121', '#4e2121', '#4e2121', '#4e2121', '#4e2121', '#4e2121'],
        ['#4e2121', '#b04343', '#b04343', '#b04343', '#b04343', '#4e2121'],
        ['#4e2121', '#b04343', '#b04343', '#b04343', '#b04343', '#4e2121'],
        ['#4e2121', '#cb5555', '#cb5555', '#cb5555', '#cb5555', '#4e2121'],
        ['#4e2121', '#cb5555', '#cb5555', '#cb5555', '#cb5555', '#4e2121'],
        ['#4e2121', '#cb5555', '#cb5555', '#cb5555', '#cb5555', '#4e2121'],
        ['#4e2121', '#b14343', '#b14343', '#b14343', '#b14343', '#4e2121'],
        ['#4e2121', '#b14343', '#b14343', '#b14343', '#b14343', '#4e2121'],
        ['#4e2121', '#9a4646', '#9a4646', '#9a4646', '#9a4646', '#4e2121'],
        ['#4e2121', '#4e2121', '#4e2121', '#4e2121', '#4e2121', '#4e2121'],
    ];


    if (batteryInterval) {
        clearInterval(batteryInterval);
        batteryInterval = null;
    }

    const startRow = 2;
    const startCol = 2;
    const batteryWidth = 30;

    let repeats = 0;
    let colors = green;
    let blinkBlock = -1;

    if (ratio >= 1) {
        repeats = 4;
    } else if (ratio >= 0.8) {
        repeats = 3;
        blinkBlock = 3;
    } else if (ratio >= 0.5) {
        colors = yellow;
        repeats = 2;
        blinkBlock = 2;
    } else {
        colors = red;
        repeats = 1;
        blinkBlock = 1;
    }

    for (let block = 0; block < repeats; block++) {
        drawBlock(block, colors, children, startRow, startCol, batteryWidth);
    }
    if (blinkBlock >= 0 && ratio < 1) {
        let visible = false;

        batteryInterval = setInterval(() => {
            if (visible) {
                clearBlock(blinkBlock, children, startRow, startCol, batteryWidth);
            } else {
                drawBlock(blinkBlock, colors, children, startRow, startCol, batteryWidth);
            }

            visible = !visible;
        }, 500);
    }

    document.querySelector('.terminal-screen > h3').textContent = ratio.toFixed(1);
}