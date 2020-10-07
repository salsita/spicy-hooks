import { promisify } from 'util'
import { resolve } from 'path'
import glob from 'glob'
import { greenBright, gray } from 'chalk'
import { readFile, writeFile } from 'fs-extra'
import { escapeRegExp } from 'lodash'

import { CommandDefinition } from '../utils/command-definition'
import { readPackageJson } from '../utils/package-json'
import { getGitHubRepository } from '../utils/github'

const globAsync = promisify(glob)

interface RedirectRefsOption {
  files: string
  ref?: string
  prefixes: string[]
  'main-branch': string
  root: string
  ignore: string
  quiet: boolean
  verbose: boolean
}

export const redirectRefsCommand: CommandDefinition<RedirectRefsOption> = {
  command: 'redirect-refs',
  description: `Redirects any link pointing to the {bold main-branch} to a specific ref (by default determined by the {bold version} property of the root {bold package.json}).

{bold Example:}
Assuming the root {bold package.json} contains {bold "version": "1.0.1"}, and the main branch of the repository is {bold master},
then running

{bold spicy redirect-refs}

will change following links

- https://github.com/owner/repo/tree/{red master}/... -> https://github.com/owner/repo/tree/{green v1.0.1}/...
- https://github.com/owner/repo/blob/{red master}/... -> https://github.com/owner/repo/blob/{green v1.0.1}/...

in all '.md' and '.html' files in the project. 
`,
  options: {
    files: {
      defaultOption: true,
      type: String,
      typeLabel: '{underline glob}',
      defaultValue: '{**/*.md,**/*.html}',
      description: `Glob pattern matching all the files to be redirected
                    (defaults to {bold \\{**/*.md,**/*.html\\}})`
    },
    ref: {
      multiple: false,
      type: String,
      required: false,
      description: `Target Git ref to be used as a substitution for {bold --main-branch}
                    (defaults to {bold v<version>} where {bold <version>} is the value of {bold version} property of the root {bold package.json})`
    },
    prefixes: {
      alias: 'p',
      type: String,
      multiple: true,
      required: false,
      description: `URL prefixes of the links that should be redirected
                  (defaults to
                  - https://github.com/<owner>/<repo>/tree
                  - https://github.com/<owner>/<repo>/blob
                  where {bold <owner>} and {bold <repo>} are extracted from the {bold repository} property of the root {bold package.json})`
    },
    'main-branch': {
      defaultValue: 'master',
      alias: 'b',
      type: String,
      description: `Name of the branch we are redirecting from
                    (defaults to {bold master})`
    },
    root: {
      alias: 'r',
      type: String,
      typeLabel: '{underline path}',
      defaultValue: './',
      description: `Path to the root package (i.e. directory where the root {bold package.json} is located)
                    (defaults to './')`
    },
    ignore: {
      alias: 'i',
      type: String,
      typeLabel: '{underline glob}',
      defaultValue: '**/node_modules/**/*.*',
      description: `Glob pattern matching files that should be excluded (previously included by {bold --files})
                    (defaults to {bold **/node_modules/**/*.*})`
    },
    quiet: {
      alias: 'q',
      type: Boolean,
      defaultValue: false,
      description: 'Suppress any output except for the final count of redirected files'
    },
    verbose: {
      alias: 'v',
      type: Boolean,
      defaultValue: false,
      description: 'Output names of all examined files'
    }
  },
  execute: async (
    {
      root,
      prefixes,
      'main-branch': mainBranch,
      files,
      ignore,
      quiet,
      verbose
    }
  ) => {
    const rootDir = resolve(root)
    const rootPackageJsonFile = resolve(rootDir, 'package.json')
    const rootPackageJson = await readPackageJson(rootPackageJsonFile)
    if (prefixes == null) {
      const { owner, repo } = getGitHubRepository(rootPackageJson)
      prefixes = [
        `https://github.com/${owner}/${repo}/tree`,
        `https://github.com/${owner}/${repo}/blob`
      ]
    }

    const targetRef = `v${rootPackageJson.version}`

    const prefixVariants = prefixes
      .map(escapeRegExp)
      .join('|')

    const replacePattern = new RegExp(`(${prefixVariants})/${mainBranch}/`, 'g')
    const replaceSubstitution = `$1/${targetRef}/`

    const resolvedFiles = await globAsync(files, { ignore })

    const redirections = await Promise.all(resolvedFiles.map(async file => {
      const content = await readFile(file, 'utf-8')
      const redirectedContent = content.replace(replacePattern, replaceSubstitution)
      if (content !== redirectedContent) {
        await writeFile(file, redirectedContent)
        if (!quiet) {
          console.log(greenBright(file))
        }
        return true
      }
      if (verbose) {
        console.log(gray(file))
      }
      return false
    }))

    console.log(`Redirected ${redirections.filter(Boolean).length} out of ${resolvedFiles.length} files `)
    return 0
  }
}
