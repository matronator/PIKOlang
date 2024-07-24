import { Parser } from '../../lib/interpreter';

export function updateIndicators(parser: Parser) {
    const directionEl = document.getElementById('direction') as HTMLElement;
    const stringModeEl = document.getElementById('stringMode') as HTMLElement;
    const conditionModeEl = document.getElementById('conditionMode') as HTMLElement;
    const gridSize = document.getElementById('gridSize') as HTMLElement;

    directionEl.innerHTML = `&${parser.pointer.direction.charAt(0)}arr;`;
    stringModeEl.textContent = parser.pointer.stringMode ? 'ON' : 'OFF';
    conditionModeEl.textContent = parser.pointer.conditionMode ? 'ON' : 'OFF';
    gridSize.textContent = `${parser.width} x ${parser.height}`;
}
