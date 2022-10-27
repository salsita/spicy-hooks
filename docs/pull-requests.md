# Pull request conventions

The only valid way of contribution to the project is through pull requests.
A sole exception is a preparation of a new release
(see [more about releasing](releasing.md#publishing-a-regular-release))
where changelogs and bumped versions must be pushed directly to the main branch.

PRs should be created against the `next` branch which is the main branch of the repository
and basically the only branch with unlimited life-span.

## Title

PR titles should follow [conventionalcommits](https://www.conventionalcommits.org/).
Because we are squashing the titles would usually be used for the final commit.
So we need them to follow the convention.

As a summary, the overall structure is:

```
<type>[optional scope][!]: <description>
```

- **type** - Describes how the change affects semver
  - `feat` or `feature` bumps _minor_ and is included in changelog
  - `fix` bumps _patch_ and is included in changelog
  - `perf` and `revert` should not affect version but are included in changelog
  - Anything else is generally ignored. It has no effect on versioning and is excluded from changelog.
    Any arbitrary type can be used but using one of the following is preferred:
    - `docs`, `style`, `chore`, `refactor`, `test`, `build`, `ci`
- **scope** - An optional identifier to highlight the affected part. It is wrapped in parentheses and directly follows the type.
  - You can e.g. use the affected package name as scope. Or the nature of the change. Basically to provide more details
- **!** - A breaking change. Reflected in versioning as _major_ bump. The change is then included in changelog regardless of its type.
- **description** - Should be self-explanatory. A summary of the PR and its changes to be merged.

Examples:

- `chore(release): v1.0.0`
- `fix: Update deps`
- `feat(core)!: Drop support for IE11`

## Unit tests

GitHub will automatically run unit tests upon opening, updating and re-opening any PR.
These tests are required to pass before the PR can be merged into the `next` branch.

## Merging

We prefer squashing commits prior to merging, which is why the other options are disabled in our GitHub repository.
Please verify that the merge commit title follows conventionalcommits and that it relfect actual changes properly.
