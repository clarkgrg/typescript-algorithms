# Packaging Notes

Notes on packaging a typescript project so a Javascript project can access it using npm. Notes taken from https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd

**1. Add** `"declaration": true` **to your** `tsconfig.json`

This tells TypeScript to emit an .d.ts definitions file along with your compiled JavaScript.

**2. Add** `"outDir": "dist"` **to your** `tsconfig.json`

This tells Typescript to output to a dist folder.

**3. Add** `"types": "index.d.ts"` **to your** `package.json`

When other people import your library, this tells the TypeScript compiler where to look for your library’s types. The filename of your .d.ts file will be the same as your main entry point. So, for example in your package.json you’ll want to have something like this in there:

```
"main": "dist/index.js",
"types": "dist/index.d.ts",
```

**4. Ensure that your** `dist` **\*folder is ignored in** `.gitignore`

We don’t want to track compiled JavaScript files in our git repository. We do, however, want them sent to NPM when we publish.

**5. Run your build**

Run tsc and whatever else to compile all your files. It might be a good idea to add a prepublish script to your package.json. Something like: "prepublish": "tsc"

**6. Run npm publish**

Boom! You just published a TypeScript based NPM package that interops seamlessly with TypeScript and JavaScript.
If you want to verify that it works locally before you publish (this is a good idea), then in your package root, run npm link . Then go to another folder and npm link <your package name> . Go into a .ts file and import your package by name (just like you would normally if you had npm installed it). You should see your types coming through in your editor.

Here’s what your final package.json might look like:

```
{
  "name": "my-ts-lib",
  "version": "1.0.0",
  "description": "My npm package written in TS",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "author": "Cameron Nokes",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^2.7.2"
  }
}
```

Here’s what your final tsconfig.json might look like:

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es2017", "es7", "es6", "dom"],
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```
