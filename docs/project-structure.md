# Project structure

The `@spicy-hooks` project consists of [several NPM packages](../README.md#packages), each of them more or less
following the structure outlined below.

The monorepo project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
to manage individual packages. This allows us to accurately simulate dependencies between
individual packages without endless copying of files.

```
.
+-- docs  
+-- packages
|   +-- <package-name>
|   |   +-- docs
|   |   +-- src
|   |   |   +-- internal
|   |   |   |   +-- <sources>
|   |   |   +-- index.ts
|   |   +-- lib
|   |   |   +-- internal
|   |   |   |   +-- <compiled-js>
|   |   |   +-- index.js
|   |   |   +-- index.d.ts
|   |   +-- tsconfig.json
|   |   +-- package.json
+-- tsconfig.json
+-- package.json 
```

### `docs`

General documentation in Markdown format for project contributors.

### `tsconfig.json`

Base TypeScript configuration inherited by all packages. Apart from that the config is used
for several advanced ESLint rules and test execution through `ts-jest`.

### `package.json`

Configuration of the whole project. It:

* declares Yarn Workspaces
* sets up development toolchain
    * TS compilation
    * ESLint
    * ts-jest
    * release preparation
* installs peer dependencies of child packages

### `packages/<package-name>`
Root folder of individual packages. Contains:

#### `./docs`

User-facing documentation for individual packages.

#### `./src`

Source code of the package. The folder usually User-facing documentation for individual packages.

Usually this contains an `internal` directory with most of the sources and an `index.ts` file that
exports selected members.

#### `./lib`

An output of TypeScript compiler that mirrors the `src` folder. Instead of `.ts` files this folder
contains compiled `.js` and generated `.d.ts` (typings).

Read more about [building packages](building-packages.md). 

#### `./tsconfig.json`

TypeScript config that inherits from the root one. It's basically the same for all packages,
but as has to be replicated in each of them separately as it contains relative paths.

#### `./package.json`

The actual definition of the individual package. 
