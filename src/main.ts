import { Grammar } from '../lib/grammar';
import { Operation, Parser } from '../lib/interpreter';
import { ConsoleOutput } from './console';
import { initDropdowns } from './dropdown';
import { updateIndicators } from './indicators';
import { SAMPLES } from './samples';

let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
let running = false;
let inProgress = false;

document.addEventListener('DOMContentLoaded', () => {
    const consoleOutput = new ConsoleOutput('console');

    initDropdowns();

    const outputEl = document.getElementById('output');
    const outputOverlayEl = document.getElementById('outputOverlay');
    const inputEl = document.getElementById('input') as HTMLTextAreaElement;
    if (!outputEl || !inputEl || !outputOverlayEl) return;

    const executeBtnEl = document.getElementById('executeBtn') as HTMLButtonElement;
    const runBtnEl = document.getElementById('runBtn') as HTMLButtonElement;
    const debugBtnEl = document.getElementById('debugBtn') as HTMLButtonElement;

    const speedRangeEl = document.getElementById('speedRange') as HTMLInputElement;
    const speedTextEl = document.getElementById('speedText') as HTMLInputElement;

    const samplesEl = document.getElementById('samples') as HTMLElement;

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
        outputEl.textContent = inputEl.value.replace(Grammar.Tokens.Pointer, ' ');
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
            runBtnEl.textContent = '🕐 Run';
        }
    });
});

function stepThrough(operation: Operation, parser: Parser, speed: number): Operation {
    operation = parser.step(operation);
    updateIndicators(parser);
    if (!operation.done) {
        const outputOverlayEl = document.getElementById('outputOverlay');
        if (!outputOverlayEl || !(outputOverlayEl instanceof HTMLElement)) return operation;

        outputOverlayEl.innerHTML = '';
        for (let i = 0; i <= parser.currentPoint.y; i++) {
            if (i === parser.currentPoint.y) {
                outputOverlayEl.innerHTML += ' '.repeat(Math.max(parser.currentPoint.x, 0));
                outputOverlayEl.innerHTML += `<span class="pointer pointer-${parser.pointer.direction}">${Grammar.Tokens.Pointer}</span>`;
            } else {
                outputOverlayEl.textContent += '\n';
            }
        }

        const registerEl = document.getElementById('register') as HTMLPreElement;
        const stringRegisterEl = document.getElementById('stringRegister') as HTMLPreElement;
        const outputRegisterEl = document.getElementById('outputRegister') as HTMLPreElement;

        registerEl.textContent = parser.pointer.stack.toString();
        stringRegisterEl.textContent = '[' + parser.pointer.stringStack.join(', ') + ']';
        outputRegisterEl.textContent = parser.outputRegister?.toString() ?? 'NULL';

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => stepThrough(operation, parser, speed), speed);
        return operation;
    } else {
        clearTimeout(timeout);
        console.log(operation.output);
        inProgress = false;
        running = false;
        return operation;
    }
}
