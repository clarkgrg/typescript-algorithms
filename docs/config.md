# Configuration Notes

## Jest Setup

This is the jest setup from https://basarat.gitbook.io/typescript/intro-1/jest

### Step 1: Install

install using npm

```
npm i jest @types/jest ts-jest typescript -D
```

Explanation:

- Install jest framework (jest)
- Install the types for jest (@types/jest)
- Install the TypeScript preprocessor for jest (ts-jest) which allows jest to transpile TypeScript on the fly and have source-map support built in.
- Install the TypeScript compiler ('typescript') which is prerequisite for 'ts-jest'.
- Save all of these to your dev dependencies (testing is almost always a npm dev-dependency)

### Step 2: Configure Jest

Add the following jest.config.js file to the root of your project:

```
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
```

(If your package.json file contains "type": "module", which causes Node to assume modules are in es6 format, you can convert the above to es6 format by replacing the top line to export default { .)

Explanation:

- We always recommend having all TypeScript files in a src folder in your project. We assume this is true and specify this using the roots option.
- The testMatch config is a glob pattern matcher for discovering .test / .spec files in ts / tsx / js format.
- The transform config just tells jest to use ts-jest for ts / tsx files.

### Step 3: Run tests

Run npx jest from the project root and jest will execute any tests you have.

#### Add script target for npm scripts

Add package.json

```
{
  "test": "jest"
}
```

- This allows you to run the tests with a simple npm t.
- And even in watch mode with npm t -- --watch.

### Sites to Review

https://www.youtube.com/playlist?list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8

## Typescript Setup

Install typescript and create tsconfig.json file. The Jest instructions above install typescript

```
npm i -D typescript
tsc -init
```

## EsLint Setup

Install a bunch of dependencies, this was intially grabbed from Wes Bos. I later changed so not sure if I can remove any of these.

npm i -D all the following

```
    "@typescript-eslint/eslint-plugin": "^4.7.0",
    "@typescript-eslint/parser": "^4.7.0",
    "babel-eslint": "^10.1.0",
    "eslint": "^7.13.0",
    "eslint-config-airbnb": "^18.2.1",
    "eslint-config-prettier": "^6.15.0",
    "eslint-config-wesbos": "^1.0.1",
    "eslint-plugin-html": "^6.1.1",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-prettier": "^3.1.4",
    "eslint-plugin-react": "^7.21.5",
    "eslint-plugin-react-hooks": "^4.2.0",
```

Create .eslintrc.js

```Javascript
module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-namespace": "off",
    "quotes": ["single"],
  },
};
```

## Prettier

Install prettier and create .prettierrc.js file

```
npm i -D prettier
```

```Javascript
module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
};
```
