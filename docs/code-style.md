# Code-style

To avoid endless discussions whether dangling commas are good or not
or whether semicolons have any sense at all (they don't),
we're using one of the well-established code-style guides
for JavaScript - the [StandardJS](https://standardjs.com).

Unfortunately StandardJS doesn't work out of the box with TypeScript,
neither it can be combined with very useful rules defined by CRA.
As a solution we're using [eslint-config-standard-with-typescript](https://github.com/standard/eslint-config-standard-with-typescript)
which is basically an ESLint config used internally by StandardJS
tweaked to support TypeScript.

In addition to the rules of StandardJS this package comes with
type aware checks that perform deeper examination of TypeScript code.
Some of these rules are quite questionable, therefore we decided to disable
few and re-configure few others. (see the [.eslintrc](../.eslintrc) file)

We've also added the `import/order` rule to issue a warning whenever
imports are not grouped as `builtins + packages` and `other`
(separated with a newline).

## Linting

To check for code-style issues and potential errors, simply run
the following command in the root of the project: 
```shell script
yarn lint
```

To fix issues that can resolved automatically just add `--fix` flag:
 ```shell script
yarn lint --fix
 ```

### Pre-push hook

Linting is required before any push to the repository and is enforced
by a pre-push hook. Note that no warnings are allowed before pushing. 

## Conventions

This is a list of un-enforced rules that we should all follow in order to
provide a good quality SDK.

### Explicit return types

We're not strictly requiring explicit return types on all functions
as that can easily become annoying. However, it is required to explicitly
declare return types of all functions and methods exported outside
of the packages. This is supposed to create a clear contract between the packages,
and user code, and thus it should prevent unintended breaking changes.
