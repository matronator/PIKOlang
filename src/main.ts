import { Grammar } from '../lib/grammar';
import { Operation, Parser, Point, Pointer } from '../lib/interpreter';
import { ConsoleOutput } from './imports/console';
import { initDropdowns } from './imports/dropdown';
import { cacheElements } from './imports/elementsCache';
import { SAMPLES } from './imports/samples';

let elements: {[k: string]: HTMLElement} = {};
let overlays: {[k: string]: HTMLElement} = {};
let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
let running = false;
let inProgress = false;

document.addEventListener('DOMContentLoaded', () => {
    const consoleOutput = new ConsoleOutput('console');

    elements = cacheElements('output', 'outputOverlay', 'input', 'executeBtn', 'runBtn', 'debugBtn', 'restartBtn', 'speedRange', 'speedText', 'samples', 'register', 'stringRegister', 'outputRegister', 'direction', 'stringMode', 'conditionMode', 'gridSize', 'mathOperator');
    initDropdowns();

    const outputEl = elements['output'];
    const outputOverlayEl = elements['outputOverlay'];
    const inputEl = elements['input'] as HTMLTextAreaElement;
    if (!outputEl || !inputEl || !outputOverlayEl) return;

    const executeBtnEl = elements['executeBtn'] as HTMLButtonElement;
    const runBtnEl = elements['runBtn'] as HTMLButtonElement;
    const debugBtnEl = elements['debugBtn'] as HTMLButtonElement;
    const restartBtnEl = elements['restartBtn'] as HTMLButtonElement;

    const speedRangeEl = elements['speedRange'] as HTMLInputElement;
    const speedTextEl = elements['speedText'] as HTMLInputElement;

    const samplesEl = elements['samples'] as HTMLElement;

    SAMPLES.forEach((sample, index) => {
        const sampleEl = document.createElement('div');
        sampleEl.classList.add('dropdown-item');
        sampleEl.textContent = `${index + 1}. ${sample.name}`;
        sampleEl.addEventListener('click', () => {
            running = false;
            inProgress = false;
            inputEl.value = sample.code;
            inputEl.dispatchEvent(new Event('input'));
        });
        samplesEl.appendChild(sampleEl);
    });

    inputEl.addEventListener('input', () => {
        outputEl.textContent = inputEl.value.replace(new RegExp(`${Grammar.Tokens.Pointer}`, 'g'), ' ');
        outputOverlayEl.textContent = inputEl.value.replace(new RegExp(`[^${Grammar.Tokens.Pointer}]`, 'g'), ' ');
    });

    speedRangeEl?.addEventListener('input', () => {
        speedTextEl.value = speedRangeEl.value;
    });

    ['input', 'change', 'blur'].forEach(event => {
        speedTextEl.addEventListener(event, () => {
            if (Number(speedTextEl.value) >= Number(speedTextEl.min) && Number(speedTextEl.value) <= Number(speedTextEl.max)) {
                speedRangeEl.value = speedTextEl.value;
            }
        });
    });


    executeBtnEl?.addEventListener('click', () => {
        const parser = new Parser(inputEl.value);
        parser.run();
    });

    let parser: Parser;
    let op: Operation;
    runBtnEl?.addEventListener('click', () => {
        if (!running) {
            if (!inProgress) {
                parser = new Parser(inputEl.value);
                const outputOverlayEl = elements['outputOverlay'];
                const ids: string[] = [];
                parser.additionalPointers.forEach((pointer, index) => {
                    if (!overlays['outputOverlay' + index]) {
                        const newOverlay = outputOverlayEl.cloneNode(true) as HTMLElement;
                        newOverlay.id = 'outputOverlay' + index;
                        newOverlay.textContent = (outputOverlayEl.textContent ?? '').replace(new RegExp(`[^${Grammar.Tokens.Pointer}]`, 'g'), ' ');
                        outputOverlayEl.parentElement?.insertAdjacentElement('beforeend', newOverlay);
                        ids.push('outputOverlay' + index);
                    }
                });
                if (ids.length > 0) {
                    overlays = cacheElements(...ids);
                }
                op = {done: false, output: ''};
                inProgress = true;
            }
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                op = stepThrough(op, parser, Number(speedRangeEl.value)), Number(speedRangeEl.value);
            });
            running = true;
            runBtnEl.textContent = '⏸️ Pause';
        } else {
            clearTimeout(timeout);
            running = false;
            runBtnEl.textContent = !inProgress ? '🕐 Run' : '▶️ Continue';
        }
    });
});

function stepThrough(operation: Operation, parser: Parser, speed: number): Operation {
    operation = parser.step(operation);

    elements['direction'].innerHTML = `&${parser.pointer.direction.charAt(0)}arr;`;
    elements['stringMode'].textContent = parser.pointer.stringMode ? 'ON' : 'OFF';
    elements['conditionMode'].textContent = parseConditionString(parser);
    elements['gridSize'].textContent = `${parser.width} x ${parser.height}`;
    elements['mathOperator'].textContent = parser.pointer.operator ?? 'NULL';

    if (!operation.done) {
        const outputOverlayEl = elements['outputOverlay'];
        if (!outputOverlayEl || !(outputOverlayEl instanceof HTMLElement)) return operation;

        updateOverlay(outputOverlayEl, parser.pointer, parser.currentPoint);
        for (const key in overlays) {
            const overlay = overlays[key];
            if (!overlay || !(overlay instanceof HTMLElement)) continue;
            updateOverlay(overlay, parser.additionalPointers[Number(key.replace('outputOverlay', ''))], parser.additionalPoints[Number(key.replace('outputOverlay', ''))]);
        }

        const registerEl = elements['register'] as HTMLPreElement;
        const stringRegisterEl = elements['stringRegister'] as HTMLPreElement;
        const outputRegisterEl = elements['outputRegister'] as HTMLPreElement;

        registerEl.textContent = parser.pointer.stack.toString();
        stringRegisterEl.textContent = '[' + parser.pointer.stringStack.join(', ') + ']';
        outputRegisterEl.textContent = parser.outputRegister?.toString() ?? 'NULL';

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => stepThrough(operation, parser, speed), speed);
        return operation;
    } else {
        clearTimeout(timeout);
        console.log(operation.output);
        elements['runBtn'].textContent = '🕐 Run';
        inProgress = false;
        running = false;
        return operation;
    }
}

function parseConditionString(parser: Parser): string {
    if (!parser.pointer.conditionMode) return 'OFF';
    const leftSide = parser.pointer.stack ?? '?';
    const rightSide = parser.pointer.comparator ?? '?';
    const operator = parser.pointer.comparisonOperator ?? '=';

    return `${leftSide} ${operator} ${rightSide}`;
}

function updateOverlay(outputOverlayEl: HTMLElement, pointer: Pointer, currentPoint: Point) {
    outputOverlayEl.innerHTML = '';
    for (let i = 0; i <= currentPoint.y; i++) {
        if (i === currentPoint.y) {
            outputOverlayEl.innerHTML += ' '.repeat(Math.max(currentPoint.x, 0));
            outputOverlayEl.innerHTML += `<span class="pointer pointer-${pointer.direction}">${Grammar.Tokens.Pointer}</span>`;
        } else {
            outputOverlayEl.textContent += '\n';
        }
    }
}
