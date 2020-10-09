# @spicy-hooks/observables

**React Hooks for easy plugging of RxJS observables into React.**

> WORK IN PROGRESS - We're still gathering reasonable arguments to lure you into using our package.

Have you ever tried _"replacing Redux with Context API and React Hooks"_?
(By the way, this must be one of the most Googled phrases in the last two years)

If you had, you must have faced at least the following questions:
* How to **optimally** work with complex shapes without triggering thousands of unnecessary renders?
* How to share transformations of the state between multiple components? 
* How to keep logic at least a bit separated from components?
     
Our answer to those questions come in the form of `@spicy-hooks/observables` package.

This package is a part of [the `@spicy-hooks` family](https://github.com/salsita/spicy-hooks).
Be sure to checkout the other interesting packages we offer.

## Concept

_TODO Describe the overall concept of RxJS powered React_

Until the above TODO is resolved, feel free to get a general idea
by:
* [reading these slides](https://docs.google.com/presentation/d/1S1cSjh5vZhoSSf7EKO30aSAKVmVfMb481MvOskAEfJk/edit?usp=sharing)
* or [watching this talk](https://www.youtube.com/watch?v=T9Etvk8bIr8)

## Installation

The package uses RxJS under the hood, but we leave it up to you to choose the version you want to use. Make sure you have one installed though.

```shell script
npm install @spicy-hooks/observables rxjs --save
```
or
```shell script
yarn add @spicy-hooks/observables rxjs
```

## Versioning

The whole `@spicy-hooks` project complies with [Semantic Versioning](https://semver.org/).
The `@spicy-hooks/observables` package is however just one package from the whole project.
Seeing the major version incremented therefore doesn't necessarily mean that there
is a breaking change in this particular package. Check the
[CHANGELOG.md](https://github.com/salsita/spicy-hooks/blob/next/packages/observables/CHANGELOG.md)
for accurate information.

It is guaranteed though, that when the major version doesn't change,
there has been no breaking change in this package.

**Warning:** The `internal` folder is excluded from any semantic versioning conventions.
Importing from this folder directly is strongly discouraged.

## Issues

Please submit any issue or feature request on
[the main project](https://github.com/salsita/spicy-hooks/issues).
_(issue templates coming soon)_

## Documentation

* [API reference](https://spicy-hooks.salsita.co/next/modules/_observables_src_index_.html) - detailed description of every included hook, operator and utility function
* [contribution guide](https://github.com/salsita/spicy-hooks/tree/next/docs) - when you want to get involved


