import { Lexer, Parser, Interpreter } from './part9';

test('Part9 - Lexer', () => {
  const lexer = new Lexer('BEGIN a := 2; END.');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(BEGIN, BEGIN)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ID, a)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(ASSIGN, :=)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(INTEGER, 2)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(SEMI, ;)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(END, END)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(DOT, .)');
  expect(lexer.get_next_token()?.toString()).toEqual('Token(EOF, null)');
});

test('Part9 - Parser', () => {
  const line = `BEGIN
  BEGIN
      number := 2;
      a := number;
      b := 10 * a + 10 * number / 4;
      c := a - - b
  END;

  x := 11;
END.`;
  const lexer = new Lexer(line);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);
  interpreter.interpret();
  const globals = interpreter.getGlobals();

  expect(globals.number).toEqual(2);
  expect(globals.a).toEqual(2);
  expect(globals.b).toEqual(25);
  expect(globals.c).toEqual(27);
  expect(globals.x).toEqual(11);
});
