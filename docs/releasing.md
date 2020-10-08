# Releasing
Whole release process is almost entirely automated. The only part you need to do manually is to update
changelogs and set proper versions. Fortunately, there's a script that you can run locally to handle this for you.
The rest of the release process is triggered by publishing a new release in GitHub UI. This tags the current
repository state with a provided version and performs all necessary release steps.
See [complete instructions](#publishing-a-regular-release) below.

## Release notes
Upon closing any PR a release draft is created/updated containing a list of PRs merged
since the previous release. The PRs are categorized based on [assigned labels](pull-requests.md#labels).

Generated release notes should be treated as subject to manual edits prior publishing the release.

## Version
The labels assigned to PRs are also used for suggesting a new version number. Based on which label
is assigned, different part of the SemVer version is incremented:

* `* breaking` - increment major version
* `* feature` - increment minor version
* any other label - increment patch version

**Important:** The same version is shared across all the packages. This means, that although
we are following the SemVer conventions, there's no guarantee that an incremented major version
of a particular package is triggered by a breaking change in that particular package.
It is guaranteed though, that when the major version doesn't change,
there has been no breaking change in any of the packages.   

## Publishing a regular release
Please follow the below steps when publishing a new release:

1. Open the drafted release in GitHub UI
    1. Finalize release notes
    1. Check whether the suggested version matches expectations
    1. Save the draft (**do not** publish yet)
1. Ensure you have the latest `next` branch checked out locally
    1. Run `yarn spicy prepare-release` in the root folder
        * Changelogs will be automatically updated; edit manually if necessary
        * Version number in all `package.json`s will be set to mach the release version
    1. Commit and push the generated changes
1. Open the drafted release in GitHub UI
    1. Publish the release

Couple of automated tasks will now run in a GH action:

* current state of the repository is tagged with appropriate version
* all packages are built
* version from `package.json` is checked (must be equal to the one specified in the release)
* unit tests are executed
* all packages are published to NPM

**Note:** It is a good practice to bump the `package.json` version after
releasing in order to indicate that any new commit targets the next release.
Bump a particular part of the SemVer version based on what you expect to
deliver with the next release (it can always by changed later).
Use `yarn spicy set-version X.X.X` to affect all `package.json`s in the project
properly.

## Releasing a hot-fix
It happens quite often, that a critical bug is found while the `next` branch
is full of new untested features and/or breaking changes. When that happens
we have to release a hot-fix for the previous version rather than releasing
the current state of `next`.

In this case you should follow these steps:
  
1. Create a new branch based on the tag of the version you're going to hot-fix 
1. Commit and push the fix
1. Open GH UI and manually draft a new release:
    1. Set tag version to `vM.N.(P+1)` where `vM.N.P` is the version you're fixing
    1. Set your new branch as the target.
    1. Set the name of the release to match the tag name
    1. Manually write down the release notes while following the structure of the auto-drafted releases
    1. Save the draft (**do not** publish yet)
1. Make sure your branch is checked out locally
    1. Run `yarn spicy prepare-release` in the root folder
        * Changelogs will be automatically updated; edit manually if necessary
        * Version number in all `package.json`s will be set to mach the release version
    1. Commit and push the generated changes
1. Open the drafted release in GitHub UI
    1. Publish the release

The same set of automated tasks as when publishing a regular release will be executed.

## Publishing a pre-release version 

It might not be possible to fully test some features of the packages without publishing them to NPM first.
To avoid shipping unstable code to public, you can use a tagged version - e.g. `alpha` or `beta`.

To publish a pre-release version, follow the instructions for releasing a hot-fix. Just make sure to:

* set the tag version to `vM.N.P-<tag>.<tag-version>` where:
    * `vM.N.P` is the next expected production release
    * `<tag>` is `alpha` or `beta` (other strings are allowed, but discouraged)
    * `<tag-version>` is a running number of this particular `alpha` or `beta` release (`0` for the first one, `1` for the second one etc.)
* set the release name to the same as above
* check the `This is a pre-release` checkbox

Submitting such a release will publish both SDK and CRA template packages to NPM using the
[`--tag <tag>` option](https://docs.npmjs.com/cli/publish#description). This will make the packages available under
`@spicy-hooks/<package>@vM.N.P-<tag>.<tag-version>` or simply `@spicy-hooks/<package>@<tag>` but will not affect the production
(`latest`) channel.
