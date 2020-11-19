import { Lexer, Parser, Interpreter } from './part10';

const code = `PROGRAM Part10AST;
  VAR
    a, b : INTEGER;
    y    : REAL;

  BEGIN {Part10AST}
    a := 2;
    b := 10 * a + 10 * a DIV 4;
    y := 20 / 7 + 3.14;
  END.  {Part10AST}`;

test('Part10 - Lexer', () => {
  const lexer = new Lexer(code);
  expect(lexer.get_next_token()?.toString()).toEqual('Token(PROGRAM, PROGRAM)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, Part10AST)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(VAR, VAR)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, a)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(,, ,)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, b)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(:, :)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER, INTEGER)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, y)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(:, :)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(REAL, REAL)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(BEGIN, BEGIN)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, a)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ASSIGN, :=)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER_CONST, 2)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, b)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ASSIGN, :=)');
  expect(lexer.get_next_token()?.toString()).toEqual(
    'Token(INTEGER_CONST, 10)'
  );
  expect(lexer.get_next_token()?.toString()).toEqual('Token(MUL, *)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, a)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(PLUS, +)');
  expect(lexer.get_next_token()?.toString()).toEqual(
    'Token(INTEGER_CONST, 10)'
  );
  expect(lexer.get_next_token()?.toString()).toEqual('Token(MUL, *)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, a)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER_DIV, DIV)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER_CONST, 4)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, y)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ASSIGN, :=)');
  expect(lexer.get_next_token()?.toString()).toEqual(
    'Token(INTEGER_CONST, 20)'
  );
  expect(lexer.get_next_token()?.toString()).toEqual('Token(FLOAT_DIV, /)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER_CONST, 7)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(PLUS, +)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(REAL_CONST, 3.14)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(END, END)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(DOT, .)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(EOF, null)');
});

test('Part10 - Parser', () => {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);
  interpreter.interpret();
  const globals = interpreter.getGlobals();

  expect(globals.a).toEqual(2);
  expect(globals.b).toEqual(25);
  expect(globals.y).toEqual(5.997142857142857);
});
