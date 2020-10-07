# Unit tests

Unit tests are run using [ts-jest](https://www.npmjs.com/package/ts-jest), which is basically a TypeScript
loader for Jest.

Tests are by default executed for all packages at once. Simply run the following command in the root directory: 
```shell script
yarn test 
```

## Hooks

We're using [React Hooks Testing Library](https://react-hooks-testing-library.com) for
testing hooks as it allows us to abstract from any component and focus on the hook directly.
The library integrates seamlessly with Jest, therefore there's no need for any special
treatment when running the tests.  

## WebStorm

To run tests within the WebStorm IDE, you have to make it read the Jest settings from the root `package.json`
because by default it looks into a `package.json` that is closest to the spec file.

1. Open the `Run / Debug Configurations` dialog
1. Expand the `Templates` section
1. Select the `Jest` template
1. Set the `Working directory:` field to the root folder of the project
1. Save the template by clicking the `OK` button

These steps will make Jest start in the root folder regardless of in which package you initiate the test.
Jest will then pick the config from the root `package.json`.  

