import { Lexer, Parser, Interpreter, SymbolTableBuilder } from './part11';

const code = `PROGRAM Part10AST;
  VAR
    a, b : INTEGER;
    y    : REAL;

  BEGIN {Part10AST}
    a := 2;
    b := 10 * a + 10 * a DIV 4;
    y := 20 / 7 + 3.14;
  END.  {Part10AST}`;

const errorCode = `PROGRAM NameError1;
VAR
   a : INTEGER;

BEGIN
   a := 2 + b;
END.`;

const errorCode2 = `PROGRAM NameError2;
VAR
   b : INTEGER;

BEGIN
   b := 1;
   a := b + 2;
END.`;

test('Part11 - Undefined Symbol', () => {
  const lexer = new Lexer(errorCode);
  const parser = new Parser(lexer);
  const tree = parser.parse();
  const symtab_builder = new SymbolTableBuilder();

  expect(() => {
    symtab_builder.visit(tree);
  }).toThrowError('Name Error b not found');
});

test('Part11 - Undeclared Symbol', () => {
  const lexer = new Lexer(errorCode2);
  const parser = new Parser(lexer);
  const tree = parser.parse();
  const symtab_builder = new SymbolTableBuilder();

  expect(() => {
    symtab_builder.visit(tree);
  }).toThrowError('Name Error a not declared');
});

test('Part11 - SymbolTable', () => {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const tree = parser.parse();
  const symtab_builder = new SymbolTableBuilder();
  symtab_builder.visit(tree);
  const symbols = symtab_builder.symtab.getSymbols();

  const interpreter = new Interpreter(tree);
  interpreter.interpret();
  const globals = interpreter.getGlobals();

  expect(symbols.INTEGER).toEqual({ name: 'INTEGER', type: null });
  expect(symbols.a).toEqual({ name: 'a', type: 'INTEGER' });
  expect(globals.a).toEqual(2);
  expect(globals.b).toEqual(25);
  expect(globals.y).toEqual(5.997142857142857);
});
