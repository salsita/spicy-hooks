# Development

Implementing mutually dependent set of libraries has always been kind of pain.
Thanks to [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
and [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
we can fortunately constraint the pain to an acceptable level.

While implementing changes in the packages simply run
```shell script
yarn watch
```
and TypeScript will ensure that any change in any package will be projected properly
to all dependent packages.

E.g. changing a signature of `isTruthy` from `@spicy-hooks/utils` should break all
packages as they all use this function.  

## Debugging in a browser

Currently, the project doesn't contain any browser facing app that you could use to debug your code in.
We are planning to introduce it soon though - probably in form of a [Storybook](https://storybook.js.org/) or similar facilitator. Stay tuned!
