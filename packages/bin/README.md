# @spicy-hooks/bin

Binary utilities used within the `@spicy-hooks` project, but useful for other projects as well. The included tool focus mainly on development and release process.

The package registers a single executable binary:

```shell script
spicy <command> [... command options ...]
```

Individual `<command>`s are briefly described below with links to detailed documentation.

## Commands

### `check-version`

Checks whether the `version` property in `package.json` of every workspace package matches the specified value.

Read [more about `check-version`](docs/check-version.md)

### `set-version`

Sets a `version` property in `package.json` of every workspace package to the specified value.

Read [more about `set-version`](docs/set-version.md)

### `prepare-release`

Pulls the latest release draft linked to the current Git branch from GitHub,
updates changelogs and set appropriate package versions.

Read [more about `prepare-release`](docs/prepare-release.md)

### `redirect-refs`

Redirects any link pointing to the main-branch to a specific ref.

Read [more about `redirect-refs`](docs/redirect-refs.md)
