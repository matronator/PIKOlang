# Syntax

| Symbol | Description | 
| ------ | ----------- | 
| `#`    | The pointer. Can only be once in the source file and always starts facing right |
| `v`    | Change the direction of the pointer downwards |
| `>`    | Change the direction of the pointer to right |
| `^`    | Change the direction of the pointer upwards |
| `<`    | Change the direction of the pointer to left |
| `"`, `'` | Enter/exit string mode (the entrance and exit characters must be same) |
| `+` | Add to the value currently in register |
| `-` | Subtract from the value currently in register |
| `/` | Divide the value currently in register |
| `*` | Multiply the value currently in register |
| `=` | Return the result of computations |
| `!` | Clear the register |
| `\|` | Split the pointer into two, one going the original direction and the other one 90° rotated |
| `[A-Za-z0-9]` | If in string mode, print the character as a string, otherwise add the value to the register (for letters use the ASCII value) |
| `?` | Enter condition mode |


## Condition mode

| Symbol | Description |
| ------ | ----------- |
| `=` | Check if the value in register is equal to the value in the next cell |
| `>` | Check if the value in register is greater than the value in the next cell |
| `<` | Check if the value in register is less than the value in the next cell |
| `!` | Check if the value in register is not equal to the value in the next cell |
