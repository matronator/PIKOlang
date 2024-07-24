import { Grammar, Guards } from './grammar';

type Direction = 'up' | 'down' | 'left' | 'right';

type OutputRegister = string | number | null;

class Pointer {
    x: number;
    y: number;
    direction: Direction;
    currentCell: string = ' ';
    stringMode: boolean = false;
    conditionMode: boolean = false;
    comparator?: number;
    comparisonOperator?: Grammar.ComparisonOperator;
    operator?: Grammar.MathOperator;
    stack: number = 0;
    stringStack: string[] = [];
    outputStack: string | number | null = null;
    stringModeInitializer?: Grammar.Quotes;

    constructor(x: number, y: number, direction: Direction = 'right') {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
}

interface Point {
    x: number;
    y: number;
}

interface TokenPoint extends Point {
    token: string;
}

type Line = TokenPoint[];
type Grid = Line[];

export type Operation = {
    done: boolean,
    output: OutputRegister,
};

export class Parser {
    private program: string;
    width: number;
    height: number;
    private grid: Grid = [];
    visualGrid: Grid = [];
    pointer: Pointer;
    currentPoint: Point = {x: 0, y: 0};
    outputRegister: OutputRegister = null;

    constructor(input: string) {
        this.program = input;
        let lines = this.program.split('\n');
        this.height = lines.length;
        this.width = lines.reduce((max, line) => Math.max(max, line.length), 0);

        lines = lines.map(line => {
            if (line.length < this.width) {
                return line + ' '.repeat(this.width - line.length);
            }
            return line;
        });

        const tempGrid = lines;

        let x = 0;
        let y = 0;
        let pointerX = 0;
        let pointerY = 0;
        let pointerSet = false;

        for (let row of tempGrid) {
            const cols = [...row];
            const line: Line = [];
            for (let col of cols) {
                if (Guards.isPointer(col)) {
                    if (pointerSet) {
                        throw new SyntaxError('Multiple pointers found');
                    }
                    pointerSet = true;
                    pointerX = x;
                    pointerY = y;
                    const point: TokenPoint = {x: x, y: y, token: ' '};
                    line[x] = point;
                    x++;
                    continue;
                }
                const point: TokenPoint = {x: x, y: y, token: col};
                line[x] = point;
                x++;
            }
            this.grid[y] = line;
            y++;
            x = 0;
        }

        this.visualGrid = this.grid.map(line => line.map(col => ({...col})));
        this.pointer = new Pointer(pointerX, pointerY, 'right');
        this.currentPoint = {x: pointerX, y: pointerY};
    }

    run() {
        let operation: Operation = { done: false, output: null };
        while (!operation.done) {
            operation = this.step(operation);
        }
        console.log(operation.output);
    }

    step(op: Operation): Operation {
        if (op.done === true) return op;
        this.move();
        const cell = this.grid[this.pointer.y][this.pointer.x];

        if (this.pointer.stringMode) {
            if (cell.token !== this.pointer.stringModeInitializer) {
                this.pointer.stringStack.push(cell.token);
                return op;
            } else {
                this.pointer.stringMode = false;
                this.pointer.stringModeInitializer = undefined;
                return op;
            }
        }

        if (this.pointer.conditionMode) {
            if (cell.token === Grammar.Tokens.LessThan) {
                this.pointer.comparisonOperator = '<';
            } else if (cell.token === Grammar.Tokens.GreaterThan) {
                this.pointer.comparisonOperator = '>';
            } else if (cell.token === Grammar.Tokens.Equals) {
                this.pointer.comparisonOperator = '=';
            }
        }

        if (Guards.isAlphaNum(cell.token)) {
        }

        switch (cell.token) {
            case Grammar.Tokens.Semicolon:
                op.done = true;
                break;
            case Grammar.Tokens.Ampersand:
                if (this.outputRegister === null) {
                    this.outputRegister = '';
                }
                this.pointer.stringStack.forEach((char: string) => {
                    this.outputRegister += char;
                });
                this.pointer.stringStack = [];
                break;
            case Grammar.Tokens.Colon:
                console.log(this.outputRegister);
                this.outputRegister = null;
                break;
            case Grammar.Tokens.ExclamationMark:
                this.pointer.stack = 0;
                this.pointer.stringStack = [];
                this.outputRegister = null;
                break;
            case Grammar.Tokens.SingleQuote:
            case Grammar.Tokens.DoubleQuote:
                this.pointer.stringMode = true;
                this.pointer.stringModeInitializer = cell.token;
                break;
            case Grammar.DirectionModifiers.DownArrow:
                this.pointer.direction = 'down';
                break;
            case Grammar.DirectionModifiers.UpArrow:
                this.pointer.direction = 'up';
                break;
            case Grammar.DirectionModifiers.LeftArrow:
                this.pointer.direction = 'left';
                break;
            case Grammar.DirectionModifiers.RightArrow:
                this.pointer.direction = 'right';
                break;
            default:
                break;
        }

        op.output = this.outputRegister;
        return op;
    }

    move() {
        const oldX = this.pointer.x;
        const oldY = this.pointer.y;
        let currentCell = this.pointer.currentCell;
        this.visualGrid[oldY][oldX].token = currentCell;

        switch (this.pointer.direction) {
            case 'up':
                this.pointer.y--;
                if (this.pointer.y < 0) {
                    this.pointer.y = this.height - 1;
                }
                break;
            case 'down':
                this.pointer.y++;
                if (this.pointer.y >= this.height) {
                    this.pointer.y = 0;
                }
                break;
            case 'left':
                this.pointer.x--;
                if (this.pointer.x < 0) {
                    this.pointer.x = this.width - 1;
                }
                break;
            case 'right':
                this.pointer.x++;
                if (this.pointer.x >= this.width) {
                    this.pointer.x = 0;
                }
                break;
        }

        this.pointer.currentCell = this.grid[this.pointer.y][this.pointer.x].token;
        this.visualGrid[this.pointer.y][this.pointer.x].token = Grammar.Tokens.Pointer;
        this.currentPoint = {x: this.pointer.x, y: this.pointer.y};
    }
}
