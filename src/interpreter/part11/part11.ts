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
  COLON = ':',
  COMMA = ',',
  //DIV = 'DIV',
  DOT = 'DOT',
  END = 'END',
  EOF = 'EOF',
  FLOAT_DIV = 'FLOAT_DIV',
  ID = 'ID',
  INTEGER = 'INTEGER',
  INTEGER_CONST = 'INTEGER_CONST',
  INTEGER_DIV = 'INTEGER_DIV',
  LPAREN = '(',
  MINUS = 'MINUS',
  MUL = 'MUL',
  PLUS = 'PLUS',
  PROGRAM = 'PROGRAM',
  REAL = 'REAL',
  REAL_CONST = 'REAL_CONST',
  RPAREN = ')',
  SEMI = 'SEMI',
  VAR = 'VAR',
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

  public isColon(): boolean {
    return this.type === eTokens.COLON;
  }

  public isComma(): boolean {
    return this.type === eTokens.COMMA;
  }

  //public isDivide(): boolean {
  //  return this.type === eTokens.DIV;
  //}

  public isDot(): boolean {
    return this.type === eTokens.DOT;
  }

  public isEnd(): boolean {
    return this.type === eTokens.END;
  }

  public isEOF(): boolean {
    return this.type === eTokens.EOF;
  }

  public isFloatDiv(): boolean {
    return this.type === eTokens.FLOAT_DIV;
  }

  public isID(): boolean {
    return this.type === eTokens.ID;
  }

  public isInteger(): boolean {
    return this.type === eTokens.INTEGER;
  }

  public isIntegerDiv(): boolean {
    return this.type === eTokens.INTEGER_DIV;
  }

  public isIntegerConst(): boolean {
    return this.type === eTokens.INTEGER_CONST;
  }

  public isLParen(): boolean {
    return this.type === eTokens.LPAREN;
  }

  public isMinus(): boolean {
    return this.type === eTokens.MINUS;
  }

  public isMultiply(): boolean {
    return this.type === eTokens.MUL;
  }

  public isPlus(): boolean {
    return this.type === eTokens.PLUS;
  }

  public isReal(): boolean {
    return this.type === eTokens.REAL;
  }

  public isRealConst(): boolean {
    return this.type === eTokens.REAL_CONST;
  }

  public isRParen(): boolean {
    return this.type === eTokens.RPAREN;
  }

  public isSemi(): boolean {
    return this.type === eTokens.SEMI;
  }

  public isVar(): boolean {
    return this.type === eTokens.VAR;
  }
}

export class Lexer {
  // client input string, eg. "3+5"
  private text: string;
  // pos is an index into text
  private pos: number = 0;
  private current_char: string | null = '';
  private RESERVED_WORDS: Record<string, Token> = {
    PROGRAM: new Token(eTokens.PROGRAM, 'PROGRAM'),
    VAR: new Token(eTokens.VAR, 'VAR'),
    DIV: new Token(eTokens.INTEGER_DIV, 'DIV'),
    INTEGER: new Token(eTokens.INTEGER, 'INTEGER'),
    REAL: new Token(eTokens.REAL, 'REAL'),
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

  private skip_comment() {
    while (this.current_char !== '}') {
      this.advance();
    }
    this.advance(); // closing "}"
  }

  private number(): Token {
    // Return a (multidigit) integer or float consumed from the input.
    let result: string = '';
    let token;
    while (this.current_char?.isdigit()) {
      result += this.current_char[0];
      this.advance();
    }

    if (this.current_char === '.') {
      result += this.current_char[0];
      this.advance();

      while (this.current_char?.isdigit()) {
        result += this.current_char[0];
        this.advance();
      }
      token = new Token(eTokens.REAL_CONST, parseFloat(result));
    } else {
      token = new Token(eTokens.INTEGER_CONST, parseInt(result));
    }
    return token;
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

      // if (this.current_char === '/') {
      //   this.advance();
      //   return new Token(eTokens.DIV, '/');
      // }

      if (this.current_char === '(') {
        this.advance();
        return new Token(eTokens.LPAREN, '(');
      }

      if (this.current_char === ')') {
        this.advance();
        return new Token(eTokens.RPAREN, ')');
      }

      if (this.current_char === '{') {
        this.advance();
        this.skip_comment();
        continue;
      }

      if (this.current_char.isdigit()) {
        return this.number();
      }

      if (this.current_char === ':') {
        this.advance();
        return new Token(eTokens.COLON, ':');
      }

      if (this.current_char === ',') {
        this.advance();
        return new Token(eTokens.COMMA, ',');
      }

      if (this.current_char === '/') {
        this.advance();
        return new Token(eTokens.FLOAT_DIV, '/');
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

class Program extends AST {
  public name: string;
  public block: AST;
  constructor(name: string, block: AST) {
    super();
    this.name = name;
    this.block = block;
  }

  public getShortName() {
    return 'Program';
  }

  public showType() {
    console.log(
      `Program { name: ${this.name}, block: ${this.block.getShortName()}}`
    );

    this.block.showType();
  }
}

/**
 * Block holds declarations and a compound statement
 */

class Block extends AST {
  public declarations: AST[];
  public compound_statement: AST;
  constructor(declarations: AST[], compound_statment: AST) {
    super();
    this.declarations = declarations;
    this.compound_statement = compound_statment;
  }

  public getShortName() {
    return 'Block';
  }

  public showType() {
    console.log('Block');
    for (const declaration of this.declarations) {
      declaration.showType;
    }
    this.compound_statement.showType();
  }
}

class VarDecl extends AST {
  public var_node: Var;
  public type_node: Type;
  constructor(var_node: Var, type_node: Type) {
    super();
    this.var_node = var_node;
    this.type_node = type_node;
  }

  public getShortName() {
    return 'VarDecl';
  }

  public showType() {
    console.log(
      `VarDecl { var_node: ${this.var_node.getShortName()}, type_node: ${this.type_node.getShortName()}}`
    );
  }
}

/**
 * Var
 */

class Type extends AST {
  private token: Token;
  public value: string;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value as string; // can't we get this from token?
  }

  public getShortName(): string {
    return 'Type';
  }
  public showType(): void {
    console.log(
      `Type: { token: ${this.token.type.toString()}, value: ${this.value}}`
    );
  }
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
    console.log('Compound:');
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

class Symbol {
  constructor(public name: string, public type: string | null = null) {}

  public toString() {
    return this.name;
  }
}

class BuiltinTypeSymbol extends Symbol {
  constructor(public name: string) {
    super(name);
  }
}

class VarSymbol extends Symbol {
  constructor(public name: string, public type: string) {
    super(name, type);
  }

  toString() {
    return `<${this.name}:${this.type}>`;
  }
}

class SymbolTable {
  private symbols: Record<string, any> = {};
  constructor() {
    this.define(new BuiltinTypeSymbol('INTEGER'));
    this.define(new BuiltinTypeSymbol('REAL'));
  }

  public define(symbol: Symbol) {
    this.symbols[symbol.name] = symbol;
  }

  public lookup(name: string) {
    const symbol: Symbol = this.symbols[name] ? this.symbols[name] : null;
    return symbol;
  }

  toString() {
    const values: Symbol[] = [];
    for (let key in this.symbols) {
      values.push(this.symbols[key] as Symbol);
    }
    const s = `Symbols: ${values.join(',')}`;
    return s;
  }

  getSymbols() {
    return { ...this.symbols };
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
   * program : PROGRAM variable SEMI block DOT
   */
  private program(): AST {
    this.eat(eTokens.PROGRAM);
    const var_node = this.variable();
    const prog_name = <string>var_node.value!;
    this.eat(eTokens.SEMI);
    const block_node = this.block();
    const program_node = new Program(prog_name, block_node);
    this.eat(eTokens.DOT);
    return program_node;
  }

  /**
   * block: declarations compound_statement
   */

  private block(): AST {
    const declaration_nodes: AST[] = this.declarations();
    const compound_statement_node = this.compound_statement();
    const node = new Block(declaration_nodes, compound_statement_node);
    return node;
  }

  /**
   * declarations : VAR (variable_declaration SEMI)+
   *                | empty
   */
  private declarations(): AST[] {
    let declarations: AST[] = [];
    if (this.current_token?.isVar()) {
      this.eat(eTokens.VAR);
      while (this.current_token.isID()) {
        const var_decl = this.variable_declaration();
        declarations = declarations.concat(var_decl);
        this.eat(eTokens.SEMI);
      }
    }
    return declarations;
  }

  /**
   * variable_declaration : ID (COMMA ID)* COLON type_spec
   */

  private variable_declaration() {
    const var_nodes = [new Var(this.current_token!)];
    this.eat(eTokens.ID);

    while (this.current_token?.isComma()) {
      this.eat(eTokens.COMMA);
      var_nodes.push(new Var(this.current_token));
      this.eat(eTokens.ID);
    }

    this.eat(eTokens.COLON);

    const type_node = this.type_spec();
    const var_declarations = [];
    for (const var_node of var_nodes) {
      var_declarations.push(new VarDecl(var_node, type_node));
    }

    return var_declarations;
  }

  /**
   * type_spec: : INTEGER
   *              | REAL
   */

  private type_spec() {
    const token = this.current_token;
    if (this.current_token?.isInteger()) {
      this.eat(eTokens.INTEGER);
    } else {
      this.eat(eTokens.REAL);
    }
    const node = new Type(token!);
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
   *           | INTEGER_CONST
   *           | REAL_CONST
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
    } else if (token?.isIntegerConst()) {
      this.eat(eTokens.INTEGER_CONST);
      return new Num(token);
    } else if (token?.isRealConst()) {
      this.eat(eTokens.REAL_CONST);
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
    // term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)*
    let node: AST = this.factor();

    while (
      this.current_token?.isMultiply() ||
      this.current_token?.isIntegerDiv() ||
      this.current_token?.isFloatDiv()
    ) {
      let token: Token = this.current_token!;
      if (token.isMultiply()) {
        this.eat(eTokens.MUL);
      } else if (token.isIntegerDiv()) {
        this.eat(eTokens.INTEGER_DIV);
      } else if (token.isFloatDiv()) {
        this.eat(eTokens.FLOAT_DIV);
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
    } else if (node.getName() === 'Program') {
      return this.visit_Program(node);
    } else if (node.getName() === 'Block') {
      return this.visit_Block(node);
    } else if (node.getName() === 'VarDecl') {
      return this.visit_VarDecl(node);
    } else if (node.getName() === 'Type') {
      return this.visit_Type(node);
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

  protected abstract visit_Program(node: AST): void;
  protected abstract visit_Block(node: AST): void;
  protected abstract visit_VarDecl(node: AST): void;
  protected abstract visit_Type(node: AST): void;
  protected abstract visit_BinOp(node: AST): number | undefined;
  protected abstract visit_Num(node: AST): string | number | null;
  protected abstract visit_UnaryOp(node: AST): number | undefined;
  protected abstract visit_Compound(node: AST): void;
  protected abstract visit_NoOp(node: AST): void;
  protected abstract visit_Assign(node: AST): void;
  protected abstract visit_Var(node: AST): any;
}

export class SymbolTableBuilder extends NodeVisitor {
  public symtab: SymbolTable = new SymbolTable();

  protected visit_Program(node: Program) {
    this.visit(node.block);
  }

  protected visit_Block(node: Block) {
    for (const declaration of node.declarations) {
      this.visit(declaration);
    }
    this.visit(node.compound_statement);
  }

  // @ts-ignore
  protected visit_BinOp(node: BinOp) {
    this.visit(node.left);
    this.visit(node.right);
  }

  // @ts-ignore
  protected visit_Num(node: Num) {}

  // @ts-ignore
  protected visit_UnaryOp(node: UnaryOp) {
    this.visit(node.expr);
  }

  protected visit_Compound(node: Compound) {
    for (const child of node.children) {
      this.visit(child);
    }
  }

  protected visit_NoOp(node: NoOp) {}

  protected visit_VarDecl(node: VarDecl) {
    const type_name = node.type_node.value;
    const type_symbol = this.symtab.lookup(type_name!);
    const var_name = node.var_node.value as string;
    const var_symbol = new VarSymbol(var_name, type_name);
    this.symtab.define(var_symbol);
  }

  protected visit_Type(node: Type) {}

  protected visit_Assign(node: Assign) {
    const var_name = <string>node.left.value;
    const var_symbol = this.symtab.lookup(var_name);

    if (!var_symbol) {
      this.error(`Name Error ${var_name} not declared`);
    }

    this.visit(node.right);
  }

  protected visit_Var(node: Var) {
    const var_name = <string>node.value;
    const var_symbol = this.symtab.lookup(var_name);

    if (!var_symbol) {
      this.error(`Name Error ${var_name} not found`);
    }
  }
}

export class Interpreter extends NodeVisitor {
  //private parser: Parser;
  private tree: AST;
  private GLOBAL_SCOPE: Record<string, any> = {};

  constructor(tree: AST) {
    super();
    this.tree = tree;
  }

  protected visit_Program(node: Program): void {
    this.visit(node.block);
  }

  protected visit_Block(node: Block): void {
    for (const declaration of node.declarations) {
      this.visit(declaration);
    }
    this.visit(node.compound_statement);
  }

  protected visit_VarDecl(node: VarDecl): void {
    return;
  }

  protected visit_Type(node: Type): void {
    return;
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
    } else if (node.op.isIntegerDiv()) {
      return Math.floor(this.visit(node.left) / this.visit(node.right));
    } else if (node.op.isFloatDiv()) {
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

  public interpret(showASTTree: boolean = false) {
    //let tree = this.parser.parse();
    if (showASTTree) this.tree.showType();
    this.visit(this.tree);
  }
}

export async function main(showASTTree: boolean = false) {
  const line = `PROGRAM Part10AST;
    VAR
      a, b : INTEGER;
      y    : REAL;
    
    BEGIN {Part10AST}
      a := 2;
      b := 10 * a + 10 * a DIV 4;
      y := 20 / 7 + 3.14;
    END.  {Part10AST}`;
  try {
    const lexer = new Lexer(line);
    // for lexer debugging
    let done = true;
    let i = 0;

    while (!done) {
      const token = lexer.get_next_token()?.toString();
      token ? console.log(token) : (done = true);
      i++;
      if (i > 100) done = true;
    }
    const parser = new Parser(lexer);
    const tree = parser.parse();
    const symtab_builder = new SymbolTableBuilder();
    symtab_builder.visit(tree);
    console.debug(symtab_builder.symtab);

    const interpreter = new Interpreter(tree);
    interpreter.interpret(showASTTree);
    console.log(interpreter.getGlobals());
  } catch (err) {
    console.log(err);
  }
}

function nameError() {
  const line = `PROGRAM NameError1;
  VAR
     a : INTEGER;
  
  BEGIN
     a := 2 + b;
  END.
  `;
  try {
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const tree = parser.parse();
    const symtab_builder = new SymbolTableBuilder();
    symtab_builder.visit(tree);
    console.debug(symtab_builder.symtab);

    //const interpreter = new Interpreter(tree);
    //interpreter.interpret();
    //console.log(interpreter.getGlobals());
  } catch (err) {
    console.log(err);
  }
}

//main(false);
//nameError();
