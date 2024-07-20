export class ConsoleOutput {
    constructor(wrapperElementId = 'console-output') {
        if (console.log.toDiv) {
            return;
        }

        function toString(x) {
            return typeof x === 'string' ? x : JSON.stringify(x);
        }

        const log = console.log.bind(console);
        const error = console.error.bind(console);
        const warn = console.warn.bind(console);
        const table = console.table ? console.table.bind(console) : null;
        const consoleId = 'console-outer';

        // Create the Console Div container.
        function createOuterElement(id) {
            let outer = document.getElementById(id);
            if (!outer) {
                outer = document.createElement('fieldset');
                outer.id = id;
                document.body.appendChild(outer);
            }
            let style = outer.style;
            return outer;
        }

        // Create the logging div and adornments.
        const logTo = (function createLogDiv() {
            const outer = createOuterElement(consoleId);
            const caption = document.createTextNode('Console Output');
            const legend = document.createElement('div');
            legend.id = "console-legend";
            legend.appendChild(caption);
            outer.appendChild(legend);

            const div = document.createElement('div');
            div.id = 'console-log-text';

            outer.appendChild(div);
            return div;
        }());

        function printToDiv() {
            const msg = Array.prototype.slice.call(arguments, 0).map(toString).join(' ');
            const item = document.createElement('div');
            item.classList.add('log-row');
            item.textContent = msg;
            logTo.appendChild(item);
        }

        function logWithCopy() {
            const ele = document.getElementById(consoleId);
            setDarkLight(ele);
            log.apply(null, arguments);
            printToDiv.apply(null, arguments);
        }

        console.log = logWithCopy;
        console.log.toDiv = true;

        console.error = function errorWithCopy() {
            error.apply(null, arguments);
            const args = Array.prototype.slice.call(arguments, 0);
            args.unshift('ERROR:');
            printToDiv.apply(null, args);
        };

        console.warn = function logWarning() {
            warn.apply(null, arguments);
            const args = Array.prototype.slice.call(arguments, 0);
            args.unshift('WARNING:');
            printToDiv.apply(null, args);
        };

        function printTable(objArr, keys) {
            const numCols = keys.length;
            const len = objArr.length;
            const $table = document.createElement('table');
            $table.style.width = '100%';
            $table.setAttribute('border', '1');
            const $head = document.createElement('thead');
            const $tdata = document.createElement('td');
            $tdata.innerHTML = 'Index';
            $head.appendChild($tdata);

            for (let k = 0; k < numCols; k++) {
                $tdata = document.createElement('td');
                $tdata.innerHTML = keys[k];
                $head.appendChild($tdata);
            }
            $table.appendChild($head);

            for (let i = 0; i < len; i++) {
                const $line = document.createElement('tr');
                $tdata = document.createElement('td');
                $tdata.innerHTML = i;
                $line.appendChild($tdata);

                for (let j = 0; j < numCols; j++) {
                    $tdata = document.createElement('td');
                    $tdata.innerHTML = objArr[i][keys[j]];
                    $line.appendChild($tdata);
                }
                $table.appendChild($line);
            }
            const div = document.getElementById('console-log-text');
            div.appendChild($table);
        }

        console.table = function logTable() {
            if (typeof table === 'function') {
                table.apply(null, arguments);
            }

            const objArr = arguments[0];
            let keys;

            if (typeof objArr[0] !== 'undefined') {
                keys = Object.keys(objArr[0]);
            }
            printTable(objArr, keys);
        };

        window.addEventListener('error', function (err) {
            printToDiv('EXCEPTION:', err.message + '\n  ' + err.filename, err.lineno + ':' + err.colno);
        });

        // Detect dark or light colors.

        function setDarkLight(element) {
            const color = window.getComputedStyle(element, null).backgroundColor;
            if (isDark(color)) {
                element.style.color = "rgba(255,255,255,1)";
            } else {
                element.style.color = "rgba(0,0,0,.61)";
            }
        }

        function isDark(color) {
            const match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
            return parseFloat(match[1])
                + parseFloat(match[2])
                + parseFloat(match[3])
                < 3 * 256 / 2; // r+g+b should be less than half of max (3 * 256)
        }
    }
}
