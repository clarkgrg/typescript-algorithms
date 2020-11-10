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
