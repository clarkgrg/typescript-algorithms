import './string.ext';

namespace Part3 {
  const readline = require('readline');

  enum eTokens {
    EOF = 'EOF',
    INTEGER = 'INTEGER',
    MINUS = 'MINUS',
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

    public isPlus() {
      return this.type === eTokens.PLUS;
    }

    public isMinus() {
      return this.type === eTokens.MINUS;
    }

    public isEOF() {
      return this.type === eTokens.EOF;
    }

    public isInteger() {
      return this.type === eTokens.INTEGER;
    }
  }

  class Intepreter {
    // client input string, eg. "3+5"
    private text: string;
    // pos is an index into text
    private pos: number = 0;
    // current token instance
    private current_token: Token | null = null;
    private current_char: string | null = '';

    constructor(text: string) {
      this.text = text;
      this.current_char = text[this.pos];
    }

    private error(): void {
      throw new ParsingError('Error parsing input');
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
    private get_next_token(): Token | null {
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

        this.error();
      }

      return new Token(eTokens.EOF, null);
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
        this.current_token = this.get_next_token();
      } else {
        this.error();
      }
    }

    /**
     * returns an integer token value
     */
    private term(): number {
      const token = this.current_token;
      this.eat(eTokens.INTEGER);
      return <number>token?.value!;
    }

    /**
     * arithmetic expression parser/interpreter
     */
    public expr() {
      // set current token to the first token taken from the input
      this.current_token = this.get_next_token();

      let result: number = this.term();
      while (this.current_token?.isPlus() || this.current_token?.isMinus()) {
        let token: Token = this.current_token!;
        if (token.type === eTokens.PLUS) {
          this.eat(eTokens.PLUS);
          result = result + this.term();
        } else if (token.type === eTokens.MINUS) {
          this.eat(eTokens.MINUS);
          result = result - this.term();
        }
      }

      return result;
    }
  }

  export async function main() {
    console.log(
      'Enter your equation in the form of a + b or a - b - Ctrl-C to exit'
    );
    const rl = readline.createInterface(process.stdin);

    for await (const line of rl) {
      const interpreter = new Intepreter(line);
      try {
        const result = interpreter.expr();
        console.log(`result is ${result}`);
      } catch (err) {
        if (err.name === ERROR_NAME) {
          console.log(
            'Incorrect input enter your equation in the form a + b or a - b'
          );
        } else {
          console.log(err);
        }
      }
    }
  }
}

Part3.main();
