# `spicy check-version`

Checks whether the `version` property in `package.json` of every workspace package matches the specified value.
When a workspace package specifies another one as a dependency, version range of the dependency is checked as well.

## Synopsis

```shell script
spicy check-version [--version] semver [--root path]
```

```shell script
spicy check-version --help
```
  

## Options

* `--version semver`
   * Semantic version (i.e. `<major>.<minor>.<patch>`) expected to appear in all `package.json`s
    
* `-r, --root path`
    * Path to the root package (i.e. directory where the root `package.json` is located)
    * (defaults to `./`)
    
* `-h, --help`
    * Display usage guide
