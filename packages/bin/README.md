# @spicy-hooks/bin

Binary utilities used within the `@spicy-hooks` project, but useful for other projects as well. The included tool focus mainly on development and release process.

The package registers a single executable binary:

```shell script
spicy <command> [... command options ...]
```

Individual `<command>`s are briefly described below with links to detailed documentation.

This package is a part of [the `@spicy-hooks` family](https://github.com/salsita/spicy-hooks).
Be sure to checkout the other interesting packages we offer.

## Installation

Most-likely, you will need the binaries only during development and build process,
so you can install it as a `devDependency`:

```shell script
npm install @spicy-hooks/bin --save-dev
```
or
```shell script
yarn add @spicy-hooks/bin --dev
```

## Commands

### `check-version`

Checks whether the `version` property in `package.json` of every workspace package matches the specified value.

Read [more about `check-version`](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/check-version.md)

### `set-version`

Sets a `version` property in `package.json` of every workspace package to the specified value.

Read [more about `set-version`](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/set-version.md)

### `prepare-release`

Pulls the latest release draft linked to the current Git branch from GitHub,
updates changelogs and set appropriate package versions.

Read [more about `prepare-release`](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/prepare-release.md)

### `redirect-refs`

Redirects any link pointing to the main-branch to a specific ref.

Read [more about `redirect-refs`](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/redirect-refs.md)

## Versioning

The whole `@spicy-hooks` project complies with [Semantic Versioning](https://semver.org/).
The `@spicy-hooks/bin` package is however just one package from the whole project.
Seeing the major version incremented therefore doesn't necessarily mean that there
is a breaking change in this particular package. Check the
[CHANGELOG.md](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/CHANGELOG.md)
for accurate information.

It is guaranteed though, that when the major version doesn't change,
there has been no breaking change in this package.

## Issues

Please submit any issue or feature request on [the main project](https://github.com/salsita/spicy-hooks/issues). _(issue templates coming soon)_

## Documentation

* [check-version](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/check-version.md)
* [set-version](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/set-version.md)
* [prepare-release](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/prepare-release.md)
* [redirect-refs](https://github.com/salsita/spicy-hooks/blob/next/packages/bin/docs/redirect-refs.md)
