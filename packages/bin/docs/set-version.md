# `spicy set-version`

Sets a `version` property in `package.json` of every workspace package to the specified value.
When a workspace package specifies another one as a dependency, version range
of the dependency updated as well.

## Synopsis

```shell script
spicy set-version [--version] semver [--root path]
```

```shell script
spicy set-version --help
```
  
## Options

* `--version semver`
    * Semantic version (i.e. `<major>.<minor>.<patch>`) to replace any previous version in all `package.json`s
    
* `-r, --root path`
    * Path to the root package (i.e. directory where the root `package.json` is located)
    * (defaults to `./`)
    
* `-h, --help`
    * Display usage guide
