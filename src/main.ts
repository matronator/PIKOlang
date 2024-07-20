import { Operation, Parser } from '../lib/interpreter';
import { ConsoleOutput } from './console';

document.addEventListener('DOMContentLoaded', () => {
    const consoleOutput = new ConsoleOutput('console');

    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('input') as HTMLTextAreaElement;
    if (!outputEl || !inputEl) return;

    inputEl.addEventListener('input', () => {
        outputEl.textContent = inputEl.value;
    });

    const executeBtnEl = document.getElementById('executeBtn') as HTMLButtonElement;
    const runBtnEl = document.getElementById('runBtn') as HTMLButtonElement;
    const debugBtnEl = document.getElementById('debugBtn') as HTMLButtonElement;

    const speedRangeEl = document.getElementById('speedRange') as HTMLInputElement;
    const speedTextEl = document.getElementById('speedText') as HTMLInputElement;

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

    runBtnEl?.addEventListener('click', () => {
        const parser = new Parser(inputEl.value);
        const op = {done: false, output: ''};
        setTimeout(() => stepThrough(op, parser, Number(speedRangeEl.value)), Number(speedRangeEl.value));
    });
});

function stepThrough(op: Operation, parser: Parser, speed: number) {
    op = parser.step(op);
    if (!op.done) {
        const out = document.getElementById('output');
        const lines = parser.visualGrid.map(line => {
            return line.map(col => {
                return col.token;
            }).join('');
        });
        const output = lines.join('\n');
        out!.textContent = output;
        setTimeout(() => stepThrough(op, parser, speed), speed);
    } else {
        console.log(op.output);
    }
}
