import '../string.ext';

const readline = require('readline');

/***********************************************************************
 *
 *  LEXER
 *  Export the Lexer so we can test it
 *
 ***********************************************************************/

enum eTokens {
  ASSIGN = 'ASSIGN',
  BEGIN = 'BEGIN',
  DIV = 'DIV',
  DOT = 'DOT',
  END = 'END',
  EOF = 'EOF',
  ID = 'ID',
  INTEGER = 'INTEGER',
  LPAREN = '(',
  MINUS = 'MINUS',
  MUL = 'MUL',
  PLUS = 'PLUS',
  RPAREN = ')',
  SEMI = 'SEMI',
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

export class Token {
  constructor(public type: eTokens, public value: number | string | null) {}

  public toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  public isAssign(): boolean {
    return this.type === eTokens.ASSIGN;
  }

  public isBegin(): boolean {
    return this.type === eTokens.BEGIN;
  }

  public isPlus(): boolean {
    return this.type === eTokens.PLUS;
  }

  public isDot(): boolean {
    return this.type === eTokens.DOT;
  }

  public isEnd(): boolean {
    return this.type === eTokens.END;
  }

  public isMinus(): boolean {
    return this.type === eTokens.MINUS;
  }

  public isEOF(): boolean {
    return this.type === eTokens.EOF;
  }

  public isID(): boolean {
    return this.type === eTokens.ID;
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

  public isSemi(): boolean {
    return this.type === eTokens.SEMI;
  }
}

export class Lexer {
  // client input string, eg. "3+5"
  private text: string;
  // pos is an index into text
  private pos: number = 0;
  private current_char: string | null = '';
  private RESERVED_WORDS: Record<string, Token> = {
    BEGIN: new Token(eTokens.BEGIN, 'BEGIN'),
    END: new Token(eTokens.END, 'END'),
  };

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

  private peek(): string | null {
    const peek_pos = this.pos + 1;
    if (peek_pos > this.text.length) {
      return null;
    } else {
      return this.text[peek_pos];
    }
  }

  private _id() {
    let result: string = '';
    while (this.current_char?.isalnum()) {
      result += this.current_char;
      this.advance();
    }
    return this.RESERVED_WORDS[result]
      ? this.RESERVED_WORDS[result]
      : new Token(eTokens.ID, result);
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

      if (this.current_char.isalpha()) {
        return this._id();
      }

      if (this.current_char === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(eTokens.ASSIGN, ':=');
      }

      if (this.current_char === ';') {
        this.advance();
        return new Token(eTokens.SEMI, ';');
      }

      if (this.current_char === '.') {
        this.advance();
        return new Token(eTokens.DOT, '.');
      }

      if (this.current_char.isdigit()) {
        return new Token(eTokens.INTEGER, this.integer());
      }

      if (this.current_char === '+') {
        this.advance();
        return new Token(eTokens.PLUS, '+');
      }

      if (this.current_char === '-') {
        this.advance();
        return new Token(eTokens.MINUS, '-');
      }

      if (this.current_char === '*') {
        this.advance();
        return new Token(eTokens.MUL, '*');
      }

      if (this.current_char === '/') {
        this.advance();
        return new Token(eTokens.DIV, '/');
      }

      if (this.current_char === '(') {
        this.advance();
        return new Token(eTokens.LPAREN, '(');
      }

      if (this.current_char === ')') {
        this.advance();
        return new Token(eTokens.RPAREN, ')');
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

  /**
   * Add some abstract classes to provide visiblity to our tree
   */
  public abstract getShortName(): string;
  public abstract showType(): void;
}

/**
 * Compound
 */

class Compound extends AST {
  public children: AST[] = [];
  constructor() {
    super();
  }

  public getShortName() {
    return 'Compound';
  }
  public showType() {
    for (const child of this.children) {
      child.showType();
    }
  }
}

/**
 * Assign
 */

class Assign extends AST {
  public left: Var;
  public op: Token;
  public right: AST;
  constructor(left: Var, op: Token, right: AST) {
    super();
    this.left = left;
    this.op = op;
    this.right = right;
  }

  public getShortName() {
    return 'Assign';
  }
  public showType() {
    console.log(
      `Assign: { left: ${this.left.getShortName()}, op: ${
        this.op.type
      }, right: ${this.right.getShortName()}}`
    );

    this.left.showType();
    this.right.showType();
  }
}

/**
 * Var
 */

class Var extends AST {
  private token: Token;
  public value: number | string | null;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value; // can't we get this from token?
  }

  public getShortName(): string {
    return this.value?.toString()!;
  }
  public showType(): void {
    console.log(`Var: { value: ${this.value}}`);
  }
}

/**
 * NoOp
 */
class NoOp extends AST {
  constructor() {
    super();
  }

  public getShortName(): string {
    return 'NoOp';
  }
  public showType(): void {
    console.log(`NoOp:`);
  }
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

  public getShortName() {
    return 'BinOp';
  }
  /**
   * showType() - Prints out the AST tree
   */
  public showType(): void {
    console.log(
      `BinOp: { left: ${this.left.getShortName()}, op: ${
        this.op.type
      }, right: ${this.right.getShortName()}}`
    );

    this.left.showType();
    this.right.showType();
  }
}

/**
 * Num
 */
class Num extends AST {
  private token: Token;
  public value: number | string | null;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value; // can't we get this from token?
  }

  public getShortName(): string {
    return this.value?.toString()!;
  }
  public showType(): void {
    console.log(`Num: { value: ${this.value}}`);
  }
}

/**
 * UnaryOp
 */
class UnaryOp extends AST {
  public op: Token;
  public expr: AST;

  constructor(op: Token, expr: AST) {
    super();
    this.op = op;
    this.expr = expr;
  }

  public getShortName(): string {
    return `Unary ${this.op.type}`;
  }

  public showType(): void {
    console.log(
      `Unary: { value: ${this.op.type}, expr: ${this.expr.getShortName()}}`
    );

    this.expr.showType();
  }
}

export class Parser {
  public current_token: Token | null = null;
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
   * program : compound_statement DOT
   */
  private program(): AST {
    const node = this.compound_statement();
    this.eat(eTokens.DOT);
    return node;
  }

  /**
   * compound_statement: BEGIN statement_list END
   */

  private compound_statement(): AST {
    this.eat(eTokens.BEGIN);
    const nodes = this.statement_list();
    this.eat(eTokens.END);

    const root = new Compound();
    for (const node of nodes) {
      root.children.push(node);
    }

    return root;
  }

  /**
   *
   * statement_list : statement
   *                | statement SEMI statement_list
   */

  private statement_list(): AST[] {
    const node = this.statement();

    const results: AST[] = [node];

    while (this.current_token?.isSemi()) {
      this.eat(eTokens.SEMI);
      results.push(this.statement());
    }

    if (this.current_token?.isID()) {
      this.error();
    }

    return results;
  }

  /**
   * statement : compound_statement
   *           | assignment_statement
   *           | empty
   */
  private statement(): AST {
    let node: AST;
    if (this.current_token?.isBegin()) {
      node = this.compound_statement();
    } else if (this.current_token?.isID()) {
      node = this.assignment_statement();
    } else {
      node = this.empty();
    }
    return node;
  }

  /**
   * assignment_statement : variable ASSIGN expr
   */
  private assignment_statement(): AST {
    const left = this.variable();
    const token = this.current_token;
    this.eat(eTokens.ASSIGN);
    const right = this.expr();
    const node = new Assign(left, token!, right);
    return node;
  }

  /**
   * variable : ID
   */
  private variable(): Var {
    const node = new Var(this.current_token!);
    this.eat(eTokens.ID);
    return node;
  }

  /**
   * An empty production
   */
  private empty(): AST {
    return new NoOp();
  }

  /**
   * factor :   PLUS  factor
   *           | MINUS factor
   *           | INTEGER
   *           | LPAREN expr RPAREN
   *           | variable
   */
  private factor(): AST {
    const token = this.current_token;
    if (token?.isPlus()) {
      this.eat(eTokens.PLUS);
      return new UnaryOp(token, this.factor());
    } else if (token?.isMinus()) {
      this.eat(eTokens.MINUS);
      return new UnaryOp(token, this.factor());
    } else if (token?.isInteger()) {
      this.eat(eTokens.INTEGER);
      return new Num(token);
    } else if (token?.isLParen()) {
      this.eat(eTokens.LPAREN);
      const node: AST = this.expr();
      this.eat(eTokens.RPAREN);
      return node;
    } else {
      return this.variable();
    }
  }

  private term(): AST {
    // """term : factor ((MUL | DIV) factor)*"""
    let node: AST = this.factor();

    while (this.current_token?.isMultiply() || this.current_token?.isDivide()) {
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
    const node = this.program();
    if (!this.current_token?.isEOF()) {
      this.error();
    }
    return node;
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
    } else if (node.getName() === 'UnaryOp') {
      return this.visit_UnaryOp(node);
    } else if (node.getName() === 'Compound') {
      return this.visit_Compound(node);
    } else if (node.getName() === 'NoOp') {
      return this.visit_NoOp(node);
    } else if (node.getName() === 'Assign') {
      return this.visit_Assign(node);
    } else if (node.getName() === 'Var') {
      return this.visit_Var(node);
    }

    this.error('No visit_method()');
  }

  protected error(errName: string): void {
    throw new ParsingError(errName);
  }

  protected abstract visit_BinOp(node: AST): number | undefined;
  protected abstract visit_Num(node: AST): string | number | null;
  protected abstract visit_UnaryOp(node: AST): number | undefined;
  protected abstract visit_Compound(node: AST): void;
  protected abstract visit_NoOp(node: AST): void;
  protected abstract visit_Assign(node: AST): void;
  protected abstract visit_Var(node: AST): any;
}

export class Interpreter extends NodeVisitor {
  private parser: Parser;
  private GLOBAL_SCOPE: Record<string, any> = {};

  constructor(parser: Parser) {
    super();
    this.parser = parser;
  }

  protected visit_Compound(node: Compound): void {
    for (const child of node.children) {
      this.visit(child);
    }
  }

  protected visit_NoOp(node: NoOp): void {
    return;
  }

  protected visit_Assign(node: Assign): void {
    const var_name = node.left.value;
    this.GLOBAL_SCOPE[var_name!] = this.visit(node.right);
  }

  protected visit_Var(node: Var): any {
    const var_name = node.value!;
    const val = this.GLOBAL_SCOPE[var_name]
      ? this.GLOBAL_SCOPE[var_name]
      : null;
    if (val) {
      return val;
    } else {
      this.error(`Name error: ${var_name} not found`);
    }
  }

  protected visit_BinOp(node: BinOp): number | undefined {
    if (node.op.isPlus()) {
      return this.visit(node.left) + this.visit(node.right);
    } else if (node.op.isMinus()) {
      return this.visit(node.left) - this.visit(node.right);
    } else if (node.op.isMultiply()) {
      return this.visit(node.left) * this.visit(node.right);
    } else if (node.op.isDivide()) {
      return this.visit(node.left) / this.visit(node.right);
    }

    // Should never get here
    this.error('parsing error');
  }

  protected visit_Num(node: Num): string | number | null {
    return node.value;
  }

  protected visit_UnaryOp(node: UnaryOp): number | undefined {
    if (node.op.isPlus()) {
      return +this.visit(node.expr);
    } else if (node.op.isMinus()) {
      return -this.visit(node.expr);
    }

    // Should never get here
    this.error('Parsing error');
  }

  public getGlobals() {
    return { ...this.GLOBAL_SCOPE };
  }

  public interpret() {
    let tree = this.parser.parse();
    //tree.showType();
    this.visit(tree);
  }
}

export async function main() {
  const line = `BEGIN
       BEGIN
           number := 2;
           a := number;
           b := 10 * a + 10 * number / 4;
           c := a - - b
       END;
  
       x := 11;
    END.`;
  try {
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    interpreter.interpret();
    console.log(interpreter.getGlobals());
  } catch (err) {
    console.log(err);
  }
}

//main();
