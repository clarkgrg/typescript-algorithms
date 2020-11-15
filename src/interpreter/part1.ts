namespace Part1 {
  const readline = require('readline');

  enum eTokens {
    INTEGER = 'INTEGER',
    PLUS = 'PLUS',
    EOF = 'EOF',
  }

  // jQuery - return !isNaN(s - parseFloat(s));
  const isNumeric = (num: string) => {
    return !isNaN(parseInt(num));
  };

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
  }

  class Intepreter {
    // client input string, eg. "3+5"
    private text: string;
    // pos is an index into text
    private pos: number = 0;
    // current token instance
    private current_token: Token | null = null;

    constructor(text: string) {
      this.text = text;
    }

    private error() {
      throw new ParsingError('Error parsing input');
    }

    /**
     * lexical analyzer (also known as scanner or tokenizer)
     *
     * This method is responsible for breaking a sentence
     * apart into tokens. One token at a time.
     */
    private get_next_token(): Token | null {
      const text = this.text;

      // is os index past the end of the text ?
      // if so, then return EOF token because there is no more
      // input left to convert into tokens
      if (this.pos > text.length - 1) {
        return new Token(eTokens.EOF, null);
      }

      // get a character at the position pos and decide
      // what token to create based on the single character
      const current_char = text[this.pos];

      // if the character is a digit then convert it to
      // integer, create an INTEGER token, increment self.pos
      // index to point to the next character after the digit,
      // and return the INTEGER token
      if (isNumeric(current_char)) {
        this.pos++;
        return new Token(eTokens.INTEGER, parseInt(current_char));
      }

      if (current_char === '+') {
        this.pos++;
        return new Token(eTokens.PLUS, current_char);
      }

      this.error();

      // We will never get here
      return null;
    }

    private eat(token_type: eTokens): void {
      if (this.current_token?.type === token_type) {
        this.current_token = this.get_next_token();
      } else {
        this.error();
      }
    }

    public expr() {
      // "expr -> INTEGER PLUS INTEGER"
      // set current token to the first token taken from the input
      this.current_token = this.get_next_token();

      // we expect the current token to be a single-digit integer
      const left = this.current_token;
      this.eat(eTokens.INTEGER);

      // we expect the current token to be a '+' token
      const op = this.current_token;
      this.eat(eTokens.PLUS);

      // we expect the current token to be a single-digit integer
      const right = this.current_token;
      this.eat(eTokens.INTEGER);

      //after the above call the self.current_token is set to EOF token

      // at this point INTEGER PLUS INTEGER sequence of tokens
      // has been successfully found and the method can just
      // return the result of adding two integers, thus
      // effectively interpreting client input
      const result = <number>left?.value + <number>right?.value;
      return result;
    }
  }

  export async function main() {
    console.log('Enter your equation in the form of a+b - Ctrl-C to exit');
    const rl = readline.createInterface(process.stdin);

    for await (const line of rl) {
      const interpreter = new Intepreter(line);
      try {
        const result = interpreter.expr();
        console.log(`result is ${result}`);
      } catch (err) {
        if (err.name === ERROR_NAME) {
          console.log('Incorrect input enter your equation in the form a+b');
        } else {
          console.log(err);
        }
      }
    }
  }
}

Part1.main();
