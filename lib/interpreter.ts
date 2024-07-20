import { Grammar, Guards } from './grammar';

type Direction = 'up' | 'down' | 'left' | 'right';

class Pointer {
    x: number;
    y: number;
    direction: Direction;
    currentCell: string = ' ';
    stringMode: boolean = false;
    conditionMode: boolean = false;
    comparator?: number;
    comparisonOperator?: string;
    stack?: number;
    stringStack: string[] = [];
    stringModeInitializer?: Grammar.Quotes;

    constructor(x: number, y: number, direction: Direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
}

interface Point {
    x: number;
    y: number;
    token: string;
}

type Line = Point[];
type Grid = Line[];

export type Operation = {
    done: boolean,
    output: string,
};

export class Parser {
    private program: string;
    private width: number;
    private height: number;
    private grid: Grid = [];
    visualGrid: Grid = [];
    private pointer: Pointer;

    constructor(input: string) {
        this.program = input;
        const lines = this.program.split('\n');
        this.height = lines.length;
        this.width = lines.reduce((max, line) => Math.max(max, line.length), 0);

        lines.filter(line => line.length < this.width).forEach(line => {
            line += ' '.repeat(this.width - line.length);
        });

        const tempGrid = lines;

        let x = 0;
        let y = 0;
        let pointerX = 0;
        let pointerY = 0;

        for (let row of tempGrid) {
            const cols = [...row];
            const line: Line = [];
            for (let col of cols) {
                if (Guards.isPointer(col)) {
                    pointerX = x;
                    pointerY = y;
                }
                const point: Point = {x: x, y: y, token: col};
                line[x] = point;
                x++;
            }
            this.grid[y] = line;
            y++;
            x = 0;
        }

        this.visualGrid = this.grid;
        this.pointer = new Pointer(pointerX, pointerY, 'right');
    }

    run() {
        let operation = { done: false, output: '' };
        while (!operation.done) {
            operation = this.step(operation);
        }
        console.log(operation.output);
    }

    step(op: Operation): Operation {
        if (op.done) return op;
        this.move();
        const cell = this.grid[this.pointer.y][this.pointer.x];

        if (this.pointer.stringMode) {
            if ((this.pointer.stringModeInitializer === Grammar.Tokens.SingleQuote && cell.token !== Grammar.Tokens.SingleQuote) ||
                (this.pointer.stringModeInitializer === Grammar.Tokens.DoubleQuote && cell.token !== Grammar.Tokens.DoubleQuote)) {
                    this.pointer.stringStack.push(cell.token);
                    return op;
            } else {
                this.pointer.stringMode = false;
                this.pointer.stringModeInitializer = undefined;
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
                return op;
            default:
                return op;
        }
    }

    move() {
        const oldX = this.pointer.x;
        const oldY = this.pointer.y;
        this.visualGrid[oldY][oldX].token = this.pointer.currentCell;

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
    }
}
