export module Grammar {
    export type Noop = ' ';

    export type Plus = '+';
    export type Minus = '-';
    export type Multiply = '*';
    export type Divide = '/';

    export type Underscore = '_';

    export type Equals = '=';
    export type LessThan = '<';
    export type GreaterThan = '>';

    export type QuestionMark = '?';
    export type ExclamationMark = '!';
    export type Semicolon = ';';
    export type Colon = ':';
    export type Ampersand = '&';
    export type Tilde = '~';
    // export type Dot = '.';

    export type RightArrow = '>';
    export type LeftArrow = '<';
    export type UpArrow = '^';
    export type DownArrow = 'v';

    export type SingleQuote = "'";
    export type DoubleQuote = '"';
    export type Quotes = SingleQuote | DoubleQuote;

    export type PointerSymbol = '#';
    export type PointerSplitter = '|';

    export type LowercaseChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
    export type UppercaseChar = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

    export type Char = LowercaseChar | UppercaseChar;
    export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

    export type AlphaNumChar = Char | Digit;

    export type MathOperator = Plus | Minus | Multiply | Divide;
    export type ComparisonOperator = Equals | LessThan | GreaterThan | ExclamationMark;
    export type Operator = MathOperator | ComparisonOperator;

    export type Keyword = QuestionMark | ExclamationMark | Semicolon | Colon | Ampersand | Tilde;

    export type DirectionModifier = RightArrow | LeftArrow | UpArrow | DownArrow;

    export type StringModeInitializer = SingleQuote | DoubleQuote;

    export type Token = AlphaNumChar | Operator | Keyword | StringModeInitializer | DirectionModifier | PointerSymbol | PointerSplitter;

    export enum Tokens {
        Noop = ' ',
        Pointer = '#',
        Plus = '+',
        Minus = '-',
        Multiply = '*',
        Divide = '/',
        Underscore = '_',
        Equals = '=',
        LessThan = '<',
        GreaterThan = '>',
        QuestionMark = '?',
        ExclamationMark = '!',
        Semicolon = ';',
        Colon = ':',
        Ampersand = '&',
        Tilde = '~',
        SingleQuote = "'",
        DoubleQuote = '"',
    }

    export enum DirectionModifiers {
        RightArrow = '>',
        LeftArrow = '<',
        UpArrow = '^',
        DownArrow = 'v',
    }
}

export module Guards {
    export function isPointer(char: string): char is Grammar.PointerSymbol {
        return char === Grammar.Tokens.Pointer;
    }

    export function isAlphaNum(char: string): char is Grammar.Char {
        return RegExp('^[a-zA-Z0-9]$').test(char);
    }

    export function isDigit(char: string): char is Grammar.Digit {
        return RegExp('^[0-9]$').test(char);
    }

    export function isComparisonOperator(char: string): char is Grammar.ComparisonOperator {
        return [Grammar.Tokens.Equals.toString(), Grammar.Tokens.LessThan.toString(), Grammar.Tokens.GreaterThan.toString(), Grammar.Tokens.ExclamationMark.toString()].includes(char);
    }

    export function isMathOperator(char: string): char is Grammar.MathOperator {
        return [Grammar.Tokens.Plus.toString(), Grammar.Tokens.Minus.toString(), Grammar.Tokens.Multiply.toString(), Grammar.Tokens.Divide.toString(), Grammar.Tokens.Underscore.toString()].includes(char);
    }
}
