# Pull request conventions

The only valid way of contribution to the project is through pull requests.
A sole exception is a preparation of a new release
(see [more about releasing](releasing.md#publishing-a-regular-release))
where changelogs and bumped versions must be pushed directly to the main branch
to avoid triggering release drafter and overwriting any manual changes made to
the release notes (see below).

PRs should be created against the `next` branch which is the main branch of the repository
and basically the only branch with unlimited life-span.

## Labels

We're using an automated [drafting of release notes](releasing.md#release-notes) / change log.
For that to work, PRs should be tagged with labels describing the effect of its changes.

**Note:** We are using [our own fork of `release-drafter`](https://github.com/salsita/release-drafter) that solves following issues of the original:
* https://github.com/release-drafter/release-drafter/issues/579 
* https://github.com/release-drafter/release-drafter/pull/632    

The labels have a following structure:

```
<PACKAGE> <severity>
```
Where `<PACKAGE>` is one of:

* `CORE` - `@spicy-hooks/core`
* `OBSERVABLES` - `@spicy-hooks/observables`
* `BIN` - `@spicy-hooks/bin` 
* `UTILS` - `@spicy-hooks/utils`

and `<severity>` is one of

* `breaking` - breaking change in the public API
* `feature` - new backward compatible feature or enhancement
* `fix` - fix of existing functionality

**Example:** `CORE breaking` signalizes a breaking change in the `@spicy-hooks/core` package.

If the PR combines more of the above scenarios, choose the one with the highest severity.

## Unit tests

GitHub will automatically run unit tests upon opening, updating and re-opening any PR.
These tests are required to pass before the PR can be merged into the `next` branch. 

## Merging

We prefer squashing commits prior to merging, which is why the other options are disabled in our GitHub repository. 
