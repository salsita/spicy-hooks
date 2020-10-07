# `spicy redirect-refs`

Redirects any link pointing to the main-branch to a specific ref (by default
determined by the `version` property of the root `package.json`).

This tool is very useful for versioning of documentation - i.e. links between different
parts of documentation should lead to the same version.

## Example
Assuming the root `package.json` contains `"version": "1.0.1"`, and the main
branch of the repository is `master`, then running

```shell script
spicy redirect-refs
```

will change following links

- `https://github.com/owner/repo/tree/master/...` to `https://github.com/owner/repo/tree/v1.0.1/...`
- `https://github.com/owner/repo/blob/master/...` to `https://github.com/owner/repo/blob/v1.0.1/...`

in all `.md` and `.html` files in the project.


## Synopsis
```shell script
spicy redirect-refs [[--files] glob] \
 [--ref string] [--prefixes string] ... \
 [--main-branch string] [--root path] \
 [--ignore glob] [--quiet] [--verbose]
```
  
```shell script
spicy redirect-refs --help
```

## Options
* `--files glob`             
    * Glob pattern matching all the files to be redirected
    * (defaults to `{**/*.md,**/*.html}`)
    
* `--ref string`
    * Target Git ref to be used as a substitution for `--main-branch`
    * (defaults to `v<version>` where `<version>` is the value of version property of the root `package.json`)

* `-p, --prefixes string[]`
    * URL prefixes of the links that should be redirected
    * (defaults to `https://github.com/<owner>/<repo>/tree` and `https://github.com/<owner>/<repo>/blob`
                             where `<owner>` and `<repo>` are extracted from the repository property of the root `package.json`)

* `-b, --main-branch string` 
    * Name of the branch we are redirecting from
    * (defaults to `master`)

* `-r, --root path`
    * Path to the root package (i.e. directory where the root `package.json` is located)
    * (defaults to `./`)
    
* `-i, --ignore glob`
    * Glob pattern matching files that should be excluded (previously included by `--files`)
    * (defaults to `**/node_modules/**/*.*`)
    
* `-q, --quiet`
    * Suppress any output except for the final count of redirected files
    
* `-v, --verbose`
    * Output names of all examined files
    
* `-h, --help`
    * Display usage guide
