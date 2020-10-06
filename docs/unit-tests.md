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
