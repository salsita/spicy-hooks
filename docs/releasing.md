# Releasing

Whole release process is entirely automated and handled by [`lerna-lite`](https://github.com/ghiscoding/lerna-lite).
See [complete instructions](#publishing-a-regular-release) below.

## Release notes

Release notes are reused from generated changelog.
A `GH_TOKEN` environment variable with valid token should be provided.
Otherwise the release will not be created as part of the release process.

## Version

Commits and PR titles should follow [conventionalcommits](https://www.conventionalcommits.org/).
The appropriate version bump is determined based on merged commits since the last release.

**Important:** The same version is shared across all the packages. This means, that although
we are following the SemVer conventions, there's no guarantee that an incremented major version
of a particular package is triggered by a breaking change in that particular package.
It is guaranteed though, that when the major version doesn't change,
there has been no breaking change in any of the packages.

## Publishing a regular release

Please follow the below steps when publishing a new release:

1. Ensure you have the latest `next` branch checked out locally
1. Run `yarn lerna publish` in the root folder
   - You should be presented with summary and info about the next version.
     - Stop here and cancel if you think this is wrong. Otherwise confirm and continue.
   - Changelogs will be automatically generated.
   - Version number in all `package.json`s will be set to match the release version.
   - `yarn.lock` will be updated accordingly.
   - All packages will be built.
1. You might be presented with OTP password to publish to NPM. Fill it in accordingly.
   - All packages will be published to NPM.

## Releasing a hot-fix

It happens quite often, that a critical bug is found while the `next` branch
is full of new untested features and/or breaking changes. When that happens
we have to release a hot-fix for the previous version rather than releasing
the current state of `next`.

In this case you should follow these steps:

1. Create a new branch based on the tag of the version you're going to hot-fix
1. Commit and push the fix
   - Avoid any breaking changes. It could collide with regular releases.
1. Make sure your branch is checked out locally
1. Follow the same steps as for regular release
   1. Run `yarn lerna publish` in the root folder
   1. Confirm the next version
   1. Enter the OPT password to publish to NPM.

## Publishing a pre-release version

It might not be possible to fully test some features of the packages without publishing them to NPM first.
To avoid shipping unstable code to public, you can use a tagged version - e.g. `alpha` or `beta`.

To publish a pre-release version, you can mostly follow the instructions for releasing a hot-fix with some changes.
You will basically replace the call to `yarn lerna publish`. For which you have two options:

- `yarn lerna publish prerelease --preid TAG --dist-tag TAG` where the tag is the target you want to use. E.g. `alpha` or `beta`.
- `./scripts/publish-prerelease.sh TAG` which has some basic options already predefined
