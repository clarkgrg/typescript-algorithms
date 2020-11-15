import './string.ext';

namespace Part5 {
  const readline = require('readline');

  enum eTokens {
    DIV = 'DIV',
    EOF = 'EOF',
    INTEGER = 'INTEGER',
    MINUS = 'MINUS',
    MUL = 'MUL',
    PLUS = 'PLUS',
  }

  const ERROR_NAME = 'ParsingError';
  class ParsingError extends Error {
    private date: Date;
    constructor(...params: any[]) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(...params);

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ParsingError);
      }

      this.name = ERROR_NAME;
      // Custom debugging information
      this.date = new Date();
    }
  }

  class Token {
    constructor(public type: eTokens, public value: number | string | null) {}

    public isPlus(): boolean {
      return this.type === eTokens.PLUS;
    }

    public isMinus(): boolean {
      return this.type === eTokens.MINUS;
    }

    public isEOF(): boolean {
      return this.type === eTokens.EOF;
    }

    public isInteger(): boolean {
      return this.type === eTokens.INTEGER;
    }

    public isMultiply(): boolean {
      return this.type === eTokens.MUL;
    }

    public isDivide(): boolean {
      return this.type === eTokens.DIV;
    }
  }

  class Lexer {
    // client input string, eg. "3+5"
    private text: string;
    // pos is an index into text
    private pos: number = 0;
    private current_char: string | null = '';

    constructor(text: string) {
      this.text = text;
      this.current_char = text[this.pos];
    }

    private error(): void {
      throw new ParsingError('Invalid character');
    }

    private advance(): void {
      // """Advance the 'pos' pointer and set the 'current_char' variable."""
      this.pos += 1;
      if (this.pos > this.text.length - 1) {
        this.current_char = null; // indicates End of Input
      } else {
        this.current_char = this.text[this.pos];
      }
    }

    private skip_whitespace(): void {
      while (this.current_char?.isspace()) {
        this.advance();
      }
    }

    private integer(): number {
      //  """Return a (multidigit) integer consumed from the input."""
      let result: string = '';
      while (this.current_char?.isdigit()) {
        result += this.current_char[0];
        this.advance();
      }
      return parseInt(result);
    }

    /**
     * lexical analyzer (also known as scanner or tokenizer)
     *
     * This method is responsible for breaking a sentence
     * apart into tokens. One token at a time.
     */
    public get_next_token(): Token | null {
      while (this.current_char) {
        if (this.current_char?.isspace()) {
          this.skip_whitespace();
          continue;
        }

        if (this.current_char.isdigit()) {
          return new Token(eTokens.INTEGER, this.integer());
        }

        if (this.current_char === '+') {
          this.advance();
          return new Token(eTokens.PLUS, this.current_char);
        }

        if (this.current_char === '-') {
          this.advance();
          return new Token(eTokens.MINUS, this.current_char);
        }

        if (this.current_char === '*') {
          this.advance();
          return new Token(eTokens.MUL, this.current_char);
        }

        if (this.current_char === '/') {
          this.advance();
          return new Token(eTokens.DIV, this.current_char);
        }

        this.error();
      }

      return new Token(eTokens.EOF, null);
    }
  }

  class Intepreter {
    private current_token: Token | null = null;
    private lexer: Lexer;

    constructor(lexer: Lexer) {
      this.lexer = lexer;
      this.current_token = this.lexer.get_next_token();
    }

    private error(): void {
      throw new ParsingError('Invalid Syntax');
    }

    /**
     * Parser/Interpreter code
     */

    /**
     * compare the current token type with the passed token thype and if they match
     * then 'eat' the current token and assign the next token to the current_token
     * otherwise raist and excpetion
     * @param token_type
     */
    private eat(token_type: eTokens): void {
      if (this.current_token?.type === token_type) {
        this.current_token = this.lexer.get_next_token();
      } else {
        this.error();
      }
    }

    /**
     * returns an integer token value
     */
    private factor(): number {
      const token = this.current_token;
      this.eat(eTokens.INTEGER);
      return <number>token?.value!;
    }

    private term(): number {
      // """term : factor ((MUL | DIV) factor)*"""
      let result = this.factor();

      while (
        this.current_token?.isMultiply() ||
        this.current_token?.isDivide()
      ) {
        let token: Token = this.current_token!;
        if (token.isMultiply()) {
          this.eat(eTokens.MUL);
          result = result * this.factor();
        } else if (token.isDivide()) {
          this.eat(eTokens.DIV);
          result = result / this.factor();
        }
      }

      return result;
    }

    /**
     * arithmetic expression parser/interpreter
     *
     *   calc>  14 + 2 * 3 - 6 / 2
     *   17
     *
     *   expr   : term ((PLUS | MINUS) term)*
     *   term   : factor ((MUL | DIV) factor)*
     *   factor : INTEGER
     */
    public expr() {
      let result: number = this.term();

      while (this.current_token?.isPlus() || this.current_token?.isMinus()) {
        let token: Token = this.current_token!;
        if (token.isPlus()) {
          this.eat(eTokens.PLUS);
          result = result + this.term();
        } else if (token.isMinus()) {
          this.eat(eTokens.MINUS);
          result = result - this.term();
        }
      }

      return result;
    }
  }

  export async function main() {
    console.log('Enter your equation using *, /, +, or - - Ctrl-C to exit');
    const rl = readline.createInterface(process.stdin);

    for await (const line of rl) {
      const lexer = new Lexer(line);
      try {
        const interpreter = new Intepreter(lexer);
        const result = interpreter.expr();
        console.log(`result is ${result}`);
      } catch (err) {
        if (err.name === ERROR_NAME) {
          console.log(
            `${err.message} enter your equation using  using *, /, +, or -`
          );
        } else {
          console.log(err);
        }
      }
    }
  }
}

Part5.main();
