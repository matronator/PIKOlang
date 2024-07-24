# Syntax

## Memory

The language has two memory registers and one output register:

- **Register** - A single integer value that can be modified by the program.
- **String Register** - An array of characters that can be modified by the program. When in *String Mode™️*, any characters and symbols the pointer moves over are added to the string register.
- **Output Register** - Either a number or a string that is printed when the program exits. If the output register receives a string, the whole register gets converted to a string and any further number added will be appended as a string.

| Symbol | Description |
| ------ | ----------- |
| `#`    | The pointer. Can only be once in the source file and always starts facing right |
| `;`    | Exit the program and print the current value of the output register |
| `v`    | Change the direction of the pointer downwards |
| `>`    | Change the direction of the pointer to right |
| `^`    | Change the direction of the pointer upwards |
| `<`    | Change the direction of the pointer to left |
| `"`, `'` | Enter/exit string mode (the entrance and exit characters must be same) |
| `+` | Add to the value currently in register |
| `-` | Subtract from the value currently in register |
| `/` | Divide the value currently in register |
| `*` | Multiply the value currently in register |
| `=` | Print the current value in the register |
| `_` | Floors the current value in the register to the nearest integer |
| `&` | Move the entire string register over to the output in FIFO mode |
| `~` | Pop the last element from the string register and append it to the output |
| `:` | Print the current value of the output register and clears it |
| `!` | Clear all registers |
| `\|` | Split the pointer into two, one going the original direction and the other one 90° rotated |
| `?` | Enter condition mode |
| `[A-z0-9]` | If in string mode, add the character to the string register, otherwise set the register to the value if it's a digit, or to the ASCII value of the character if it's a letter |


## Condition mode

| Symbol | Description |
| ------ | ----------- |
| `=` | Check if the value in register is equal to the value in the next cell |
| `>` | Check if the value in register is greater than the value in the next cell |
| `<` | Check if the value in register is less than the value in the next cell |
| `!` | Check if the value in register is not equal to the value in the next cell |
