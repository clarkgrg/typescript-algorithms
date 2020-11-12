# Interpreter

Ruslan Spivak created an excellent series of blog posts showing how to build an interpreter. His blog posts used the python language. To help develop my Typescript skills I am recreating his code in Typescript. His explanations of the process is excellent and well worth reading. I will let the user refer to his blog posts for explaining the Interpreter.

## Part 1. Build a simple calculator

Start by building a simple calculator (part1.ts):

- Only single digit integers are allowed in the input
- The only arithmetic operation supported at the moment is addition
- No whitespace characters are allowed anywhere in the input

Follow this link for complete instructions (in python)
[Let's Build a Simple Interpreter. Part 1](https://ruslanspivak.com/lsbasi-part1/)

Typescript learnings from part 1:

- how to create enums
- creating a custom error object
- make a variable with multiple types (number | string | null) work in all cases
- public and private variables and methods(functions)
- creating a simple repl loop

## Part 2. Improved simple calculator

Part2 (part2.ts) is new version of the calculator from Part 1 that will be able to:

- Handle whitespace characters anywhere in the input string
- Consume multi-digit integers from the input
- Subtract two integers (currently it can only add integers)

[Let's Build a Simple Interpreter. Part 2](https://ruslanspivak.com/lsbasi-part2/)

Typescript learnings from part 2:

- namespaces to avoid enum naming conflicts
- extending object prototypes in Typescript
