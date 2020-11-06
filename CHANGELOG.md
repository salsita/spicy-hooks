# v2.0.0
_Nov 6, 2020_

## `core` - Breaking changes

- Remove `useValueVersion` in favor of `useDistinctValue` (#29) @goce-cz 
- Do not export `useStateWithoutRerender` as it is dangerous (#23) @goce-cz 

## `core` - Features / enhancements

- Add `useProperty` (#30) @goce-cz 

## `observables` - Breaking changes

- Use `Object.is` as the default equality function of `usePartialSnapshot` (#25) @goce-cz 

## `bin` - Features / enhancements

- Add possibility to specify custom branch for `prepare-release` (#21) @goce-cz


# v1.0.1
_Oct 9, 2020_

## `core` - Bug fixes

- Remove labeled tuples for improved compatibility with older TS versions (#20) @goce-cz 

## `observables` - Bug fixes

- Remove labeled tuples for improved compatibility with older TS versions (#20) @goce-cz


# v1.0.0
_Oct 9, 2020_

## `core` - Features / enhancements

- Polish code and complete basic TSDoc comments (#17) @goce-cz 
- Add high level docs (#15) @goce-cz 
- Generate `typedoc` docs and upload them to S3 (#8) @goce-cz 

## `core` - Bug fixes

- Group all compiled output in `lib` folder (#6) @goce-cz 

## `observables` - Breaking changes

- Polish code and complete basic TSDoc comments (#17) @goce-cz 

## `observables` - Features / enhancements

- Add high level docs (#15) @goce-cz 
- Generate `typedoc` docs and upload them to S3 (#8) @goce-cz 

## `observables` - Bug fixes

- Group all compiled output in `lib` folder (#6) @goce-cz 

## `bin` - Breaking changes

- Simplify configuration of `prepare-release` command (#18) @goce-cz 
- Improvements, fixes and documentation for the `bin` package (#10) @goce-cz 

## `bin` - Features / enhancements

- Add `redirect-refs` command (#9) @goce-cz 

## `bin` - Bug fixes

- Group all compiled output in `lib` folder (#6) @goce-cz 

## `utils` - Features / enhancements

- Polish code and complete basic TSDoc comments (#17) @goce-cz 
- Add high level docs (#15) @goce-cz 
- Generate `typedoc` docs and upload them to S3 (#8) @goce-cz 

## `utils` - Bug fixes

- Group all compiled output in `lib` folder (#6) @goce-cz


# v0.1.0
_Oct 5, 2020_

## `bin` - Features / enhancements

- Allow to specify direct filename for a changelog (#5) @goce-cz


# v0.0.1
_Oct 5, 2020_

## `observables` - Features / enhancements

- Add high level concepts (#1) @goce-cz 

## `bin` - Features / enhancements

- Add `prepare-release` command (#3) @goce-cz


