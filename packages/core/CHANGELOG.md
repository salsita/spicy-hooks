# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.0](https://github.com/salsita/spicy-hooks/compare/v2.2.1...v3.0.0) (2022-11-22)

### Features

* Require rxjs 7.5, update all deps ([#47](https://github.com/salsita/spicy-hooks/issues/47)) ([851c940](https://github.com/salsita/spicy-hooks/commit/851c94027351c3a79973b90cc3c556514d93f5b0)) by @yuqiora

## [2.2.1](https://github.com/salsita/spicy-hooks/compare/v2.2.0...v2.2.1) (2022-10-14)

### Bug Fixes

* **core:** Introduce React 18 compatibility ([#45](https://github.com/salsita/spicy-hooks/issues/45)) ([8ad98d4](https://github.com/salsita/spicy-hooks/commit/8ad98d4150a54096314bbfd810237efd22306be3))

# [2.2.0](https://github.com/salsita/spicy-hooks/compare/v2.1.2...v2.2.0) (2022-06-09)

### Features

* Support RxJS 7 ([#43](https://github.com/salsita/spicy-hooks/issues/43)) ([12b0384](https://github.com/salsita/spicy-hooks/commit/12b038415d35e34ce42d2f696cd79e05a06d6e9c))

## 2.1.2 (2022-01-05)

### Bug fixes

- Support recent versions of React

## 2.1.0 (2021-06-17)

### Features / enhancements

- Add `core/useDisposable` (#34) @goce-cz 

### Bug fixes

- Move `deferredFn` to observables as it depends on RxJS (#41) @goce-cz 

## 2.0.0 (2020-11-06)

### Breaking changes

- Remove `useValueVersion` in favor of `useDistinctValue` (#29) @goce-cz 
- Do not export `useStateWithoutRerender` as it is dangerous (#23) @goce-cz 

### Features / enhancements

- Add `useProperty` (#30) @goce-cz 

## 1.0.1 (2020-10-09)

### Bug fixes

- Remove labeled tuples for improved compatibility with older TS versions (#20) @goce-cz 

## 1.0.0 (2020-10-09)

### Features / enhancements

- Polish code and complete basic TSDoc comments (#17) @goce-cz 
- Add high level docs (#15) @goce-cz 
- Generate `typedoc` docs and upload them to S3 (#8) @goce-cz 

### Bug fixes

- Group all compiled output in `lib` folder (#6) @goce-cz
