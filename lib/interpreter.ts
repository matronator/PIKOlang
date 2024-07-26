import { Grammar, Guards } from './grammar';

type Direction = 'up' | 'down' | 'left' | 'right';

type OutputRegister = string | number | null;

export class Pointer {
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

export interface Point {
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
    additionalPointers: Pointer[] = [];
    currentPoint: Point = {x: 0, y: 0};
    additionalPoints: Point[] = [];
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
                        this.additionalPointers.push(new Pointer(x, y));
                        this.additionalPoints.push({x, y});
                    } else {
                        pointerSet = true;
                        pointerX = x;
                        pointerY = y;
                    }
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
        this.pointer = this.move(this.pointer);
        this.additionalPointers.forEach(pointer => {
            pointer = this.move(pointer, false);
        });
        const cell = this.grid[this.pointer.y][this.pointer.x];

        let shouldContinue = this.#stringModeCheck(cell);
        if (shouldContinue) {
            return op;
        }

        shouldContinue = this.#conditionModeCheck(cell);
        if (shouldContinue) {
            return op;
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
            case Grammar.Tokens.Tilde:
                if (this.pointer.stringStack.length > 0) {
                    if (this.outputRegister === null) {
                        this.outputRegister = '';
                    }
                    this.outputRegister += this.pointer.stringStack.pop() as string;
                }
                break
            case Grammar.Tokens.ExclamationMark:
                this.pointer.stack = 0;
                this.pointer.stringStack = [];
                this.outputRegister = null;
                break;
            case Grammar.Tokens.SingleQuote:
            case Grammar.Tokens.DoubleQuote:
                this.#stringModeCheck(cell);
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
            case Grammar.Tokens.Equals:
                console.log(this.pointer.stack);
                break;
            case Grammar.Tokens.QuestionMark:
                this.pointer.conditionMode = true;
                break;
            case Grammar.Tokens.Plus:
            case Grammar.Tokens.Minus:
            case Grammar.Tokens.Multiply:
            case Grammar.Tokens.Divide:
                if (!this.pointer.operator) {
                    this.pointer.operator = cell.token as Grammar.MathOperator;
                } else {
                    this.#operatorCheck(cell);
                }
                break;
            case Grammar.Tokens.Underscore:
                this.pointer.stack = Math.floor(this.pointer.stack);
                break;
            case Grammar.Tokens.Noop:
                // no-op
                break;
            default:
                this.#operatorCheck(cell);
                break;
        }

        op.output = this.outputRegister ?? this.pointer.stack;
        return op;
    }

    move(pointer: Pointer, mainPointer: boolean = true): Pointer {
        const oldX = pointer.x;
        const oldY = pointer.y;
        let currentCell = pointer.currentCell;
        this.visualGrid[oldY][oldX].token = currentCell;

        switch (pointer.direction) {
            case 'up':
                pointer.y--;
                if (pointer.y < 0) {
                    pointer.y = this.height - 1;
                }
                break;
            case 'down':
                pointer.y++;
                if (pointer.y >= this.height) {
                    pointer.y = 0;
                }
                break;
            case 'left':
                pointer.x--;
                if (pointer.x < 0) {
                    pointer.x = this.width - 1;
                }
                break;
            case 'right':
                pointer.x++;
                if (pointer.x >= this.width) {
                    pointer.x = 0;
                }
                break;
        }

        pointer.currentCell = this.grid[pointer.y][pointer.x].token;
        this.visualGrid[pointer.y][pointer.x].token = Grammar.Tokens.Pointer;
        if (mainPointer) {
            this.currentPoint = {x: pointer.x, y: pointer.y};
        } else {
            this.additionalPoints[this.additionalPointers.indexOf(pointer)] = {x: pointer.x, y: pointer.y};
        }

        return pointer;
    }

    #stringModeCheck(cell: TokenPoint): boolean {
        if (this.pointer.stringMode) {
            if (cell.token !== this.pointer.stringModeInitializer) {
                this.pointer.stringStack.push(cell.token);
                return true;
            }
            this.pointer.stringMode = false;
            this.pointer.stringModeInitializer = undefined;
            return true;
        } else if (cell.token === Grammar.Tokens.SingleQuote || cell.token === Grammar.Tokens.DoubleQuote) {
            this.pointer.stringMode = true;
            this.pointer.stringModeInitializer = cell.token as Grammar.Quotes;
            return true;
        }

        return false;
    }

    #conditionModeCheck(cell: TokenPoint): boolean {
        if (this.pointer.conditionMode) {
            if (Guards.isComparisonOperator(cell.token)) {
                if (!this.pointer.comparisonOperator) {
                    this.pointer.comparisonOperator = cell.token as Grammar.ComparisonOperator;
                    return true;
                }
            }

            if (cell.token === Grammar.Tokens.QuestionMark && this.pointer.comparisonOperator) {
                if (!this.pointer.comparator) {
                    this.pointer.comparator = 0;
                }
                if (this.pointer.comparisonOperator === Grammar.Tokens.Equals) {
                    if (this.pointer.stack !== this.pointer.comparator) {
                        this.pointer.direction = this.#rotatePointer(false);
                    }
                } else if (this.pointer.comparisonOperator === Grammar.Tokens.LessThan) {
                    if (this.pointer.stack >= this.pointer.comparator) {
                        this.pointer.direction = this.#rotatePointer(true);
                    }
                } else if (this.pointer.comparisonOperator === Grammar.Tokens.GreaterThan) {
                    if (this.pointer.stack <= this.pointer.comparator) {
                        this.pointer.direction = this.#rotatePointer(false);
                    }
                } else if (this.pointer.comparisonOperator === Grammar.Tokens.ExclamationMark) {
                    if (this.pointer.stack === this.pointer.comparator) {
                        this.pointer.direction = this.#rotatePointer(true);
                    }
                }
                this.pointer.conditionMode = false;
                this.pointer.comparisonOperator = undefined;
                this.pointer.comparator = undefined;
                return true;
            }

            if (Guards.isDigit(cell.token)) {
                this.pointer.comparator = Number(cell.token);
            } else {
                if (cell.token !== Grammar.Tokens.Noop) {
                    this.pointer.comparator = cell.token.charCodeAt(0);
                }
            }
            return true;
        }

        return false;
    }

    #rotatePointer(anticlockwise: boolean): Direction {
        const directions: Direction[] = ['up', 'right', 'down', 'left'];
        const currentDirection = this.pointer.direction;
        const currentIndex = directions.indexOf(currentDirection);
        const newIndex = anticlockwise ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0) {
            return directions[3];
        } else if (newIndex > 3) {
            return directions[0];
        }

        return directions[newIndex];
    }

    #operatorCheck(cell: TokenPoint): boolean {
        if (this.pointer.operator) {
            switch (this.pointer.operator) {
                case Grammar.Tokens.Plus:
                    this.pointer.stack += this.#getCellAsValue(cell);
                    break;
                case Grammar.Tokens.Minus:
                    this.pointer.stack -= this.#getCellAsValue(cell);
                    break;
                case Grammar.Tokens.Multiply:
                    this.pointer.stack *= this.#getCellAsValue(cell);
                    break;
                case Grammar.Tokens.Divide:
                    this.pointer.stack /= this.#getCellAsValue(cell);
                    break;
            }
            this.pointer.operator = undefined;

            return true;
        }

        this.pointer.stack = this.#getCellAsValue(cell);
        return true;
    }

    #getCellAsValue(cell: TokenPoint): number {
        if (Guards.isDigit(cell.token)) {
            return Number(cell.token);
        }

        return cell.token.charCodeAt(0);
    }
}
