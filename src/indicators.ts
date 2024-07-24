import { Parser } from '../lib/interpreter';

export function updateIndicators(parser: Parser) {
    const directionEl = document.getElementById('direction') as HTMLElement;
    const stringModeEl = document.getElementById('stringMode') as HTMLElement;
    const conditionModeEl = document.getElementById('conditionMode') as HTMLElement;
    const gridSize = document.getElementById('gridSize') as HTMLElement;

    switch (parser.pointer.direction) {
        case 'up':
            directionEl.innerHTML = '&uarr;';
            break;
        case 'down':
            directionEl.innerHTML = '&darr;';
            break;
        case 'left':
            directionEl.innerHTML = '&larr;';
            break;
        case 'right':
            directionEl.innerHTML = '&rarr;';
            break;
    }
    stringModeEl.textContent = parser.pointer.stringMode ? 'ON' : 'OFF';
    conditionModeEl.textContent = parser.pointer.conditionMode ? 'ON' : 'OFF';
    gridSize.textContent = `${parser.width} x ${parser.height}`;
}
