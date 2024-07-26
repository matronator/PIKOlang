# Syntax

## Pointers

The program starts with `#` symbol placed anywhere on the grid. The grid can be arbitrarily large. The pointer always starts facing right and moves in the direction it is facing, executing the commands in order as they are encountered (the pointer moves over them). Currently, there can only be one pointer in the program, but in the future I want to implement concurrency with multiple pointers.

## Memory

Each pointer has two memory registers and one output register:

- **Register** - A single integer value that can be modified by the program.
- **String Register** - An array of characters that can be modified by the program. When in *String Mode™️*, any characters and symbols the pointer moves over are added to the string register.
- **Output Register** - Either a number or a string that is printed when the program exits. If the output register receives a string, the whole register gets converted to a string and any further number added will be appended as a string.

| Symbol | Description |
| ------ | ----------- |
| `#`    | The pointer. Can only be once in the source file (at the current time, will change in the future) and always starts facing right |
| `;`    | Exit the program and print the current value of the output register or if it's empty, print the current register value |
| `v`    | Change the direction of the pointer downwards |
| `>`    | Change the direction of the pointer to right. \**Different in Condition Mode* |
| `^`    | Change the direction of the pointer upwards |
| `<`    | Change the direction of the pointer to left. \**Different in Condition Mode* |
| `"`, `'` | Enter/exit string mode (the entrance and exit characters must be same) |
| `+` | Add to the value currently in register |
| `-` | Subtract from the value currently in register |
| `/` | Divide the value currently in register |
| `*` | Multiply the value currently in register |
| `=` | Print the current value in the register. \**Different in Condition Mode* |
| `_` | Floors the current value in the register to the nearest integer |
| `&` | Move the entire string register over to the output in FIFO mode |
| `~` | Pop the last element from the string register and append it to the output register |
| `:` | Print the current value of the output register and clears it |
| `!` | Clear all registers |
| `?` | Enter or exit condition mode |
| `[A-z0-9]` | If in string mode, add the character to the string register, otherwise set the register to the value if it's a digit, or to the Unicode value of the character if it's a letter |
| `\|` | **(Not yet implemented)** Split the pointer into two, one going the original direction and the other one 90° rotated. *Will be implemented in the concurrency update* |


## Condition mode

| Symbol | Description |
| ------ | ----------- |
| `=` | Check if the value in register is equal to the value in the next cell |
| `>` | Check if the value in register is greater than the value in the next cell |
| `<` | Check if the value in register is less than the value in the next cell |
| `!` | Check if the value in register is not equal to the value in the next cell |
| `?` | Evaluate the condition and if true, continue moving forward, otherwise rotate the pointer 90° clockwise |
