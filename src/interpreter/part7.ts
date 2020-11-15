import './string.ext';

namespace Part7 {
  const readline = require('readline');

  /***********************************************************************
   *
   *  LEXER
   *
   ***********************************************************************/

  enum eTokens {
    DIV = 'DIV',
    EOF = 'EOF',
    INTEGER = 'INTEGER',
    LPAREN = '(',
    MINUS = 'MINUS',
    MUL = 'MUL',
    PLUS = 'PLUS',
    RPAREN = ')',
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

    public isLParen(): boolean {
      return this.type === eTokens.LPAREN;
    }

    public isRParen(): boolean {
      return this.type === eTokens.RPAREN;
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

        if (this.current_char === '(') {
          this.advance();
          return new Token(eTokens.LPAREN, this.current_char);
        }

        if (this.current_char === ')') {
          this.advance();
          return new Token(eTokens.RPAREN, this.current_char);
        }

        this.error();
      }

      return new Token(eTokens.EOF, null);
    }
  }

  /***********************************************************************
   *
   *  PARSER
   *
   ***********************************************************************/

  abstract class AST {
    public getName(): string {
      return this.constructor.name;
    }

    public abstract showType(): void;
  }

  /**
   * BinOp
   */
  class BinOp extends AST {
    public left: AST;
    public op: Token;
    private token: Token;
    public right: AST;
    constructor(left: AST, op: Token, right: AST) {
      super();
      this.left = left;
      this.op = op;
      this.token = op;
      this.right = right;
    }

    /**
     * showType() - Prints out the AST tree
     */
    public showType(): void {
      const left =
        this.left.getName() === 'BinOp' ? 'BinOp' : (<Num>this.left).value;
      const right =
        this.left.getName() === 'BinOp' ? 'BinOp' : (<Num>this.right).value;

      console.log(
        `BinOp: { left: ${left}, op: ${this.op.type}, right: ${right}}`
      );

      this.left.showType();
      this.right.showType();
    }
  }

  class Num extends AST {
    private token: Token;
    public value: number | string | null;
    constructor(token: Token) {
      super();
      this.token = token;
      this.value = token.value; // can't we get this from token?
    }

    public showType(): void {
      console.log(`Num: { value: ${this.value}}`);
    }
  }

  class Parser {
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
     * returns an integer | LPAREN expr RPAREN
     */
    private factor(): AST {
      const token = this.current_token;
      if (token?.isInteger()) {
        this.eat(eTokens.INTEGER);
        return new Num(token);
      } else if (token?.isLParen()) {
        this.eat(eTokens.LPAREN);
        const node: AST = this.expr();
        this.eat(eTokens.RPAREN);
        return node;
      }

      // Should never get here
      this.error();
      return new Num(new Token(eTokens.EOF, null));
    }

    private term(): AST {
      // """term : factor ((MUL | DIV) factor)*"""
      let node: AST = this.factor();

      while (
        this.current_token?.isMultiply() ||
        this.current_token?.isDivide()
      ) {
        let token: Token = this.current_token!;
        if (token.isMultiply()) {
          this.eat(eTokens.MUL);
        } else if (token.isDivide()) {
          this.eat(eTokens.DIV);
        }

        node = new BinOp(node, token, this.factor());
      }

      return node;
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
    private expr(): AST {
      let node: AST = this.term();

      while (this.current_token?.isPlus() || this.current_token?.isMinus()) {
        let token: Token = this.current_token!;
        if (token.isPlus()) {
          this.eat(eTokens.PLUS);
        } else if (token.isMinus()) {
          this.eat(eTokens.MINUS);
        }

        node = new BinOp(node, token, this.term());
      }

      return node;
    }

    public parse(): AST {
      return this.expr();
    }
  }
  /***********************************************************************
   *
   *  INTERPRETER
   *
   ***********************************************************************/

  abstract class NodeVisitor {
    public visit(node: AST): any {
      if (node.getName() === 'BinOp') {
        return this.visit_BinOp(node);
      } else if (node.getName() === 'Num') {
        return this.visit_Num(node);
      }

      this.error();
    }

    private error(): void {
      throw new ParsingError('No visit_ method()');
    }

    protected abstract visit_BinOp(node: AST): any;
    protected abstract visit_Num(node: AST): string | number | null;
  }

  class Intepreter extends NodeVisitor {
    private parser: Parser;
    constructor(parser: Parser) {
      super();
      this.parser = parser;
    }

    protected visit_BinOp(node: BinOp): any {
      if (node.op.isPlus()) {
        return this.visit(node.left) + this.visit(node.right);
      } else if (node.op.isMinus()) {
        return this.visit(node.left) - this.visit(node.right);
      } else if (node.op.isMultiply()) {
        return this.visit(node.left) * this.visit(node.right);
      } else if (node.op.isDivide()) {
        return this.visit(node.left) / this.visit(node.right);
      }
    }

    protected visit_Num(node: Num): string | number | null {
      return node.value;
    }

    public interpret() {
      let tree = this.parser.parse();
      tree.showType();
      return this.visit(tree);
    }
  }

  export async function main() {
    console.log(
      'Enter your equation using (, ), *, /, +, or - - Ctrl-C to exit'
    );
    const rl = readline.createInterface(process.stdin);

    for await (const line of rl) {
      const lexer = new Lexer(line);
      try {
        const parser = new Parser(lexer);
        const interpreter = new Intepreter(parser);
        const result = interpreter.interpret();
        console.log(`result is ${result}`);
      } catch (err) {
        if (err.name === ERROR_NAME) {
          console.log(
            `${err.message} enter your equation using (, ), *, /, +, or -`
          );
        } else {
          console.log(err);
        }
      }
    }
  }
}

Part7.main();
