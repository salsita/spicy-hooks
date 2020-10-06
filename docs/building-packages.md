# Building packages

The project uses an advanced feature of TypeScript compiler called
[Project References](https://www.typescriptlang.org/docs/handbook/project-references.html).
This allows us to specify dependencies between project on the level of `tsconfig.json` and thus
ensure correct order for building all the packages.

Additionally, we're utilizing the new `--build` flag that introduces incremental compilation which span
across multiple calls to `tsc`. In other words, calling `tsc --build` twice will result in all the files
being compiled only once unless they changed in between the calls.

This feature makes sub-sequent builds and watches extremely fast.

To build **all packages** at once simply run

```shell script
yarn build
```

and the `packages/<package-name>/lib` folders will be populated with output.

In case you want to force build the packages - bypassing the incremental compilation - just use `--force` flag:

```shell script
 yarn build --force
 ```

**Note:** Due to the incremental build it makes little sense to attempt to build a single package only.
Especially when the packages depend on each other.
