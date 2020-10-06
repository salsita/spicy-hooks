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
  filePattern: string
  prefixes: string[]
  'main-branch': string
  root: string
  ignore: string
  quiet: boolean
  verbose: boolean
}

export const redirectRefsCommand: CommandDefinition<RedirectRefsOption> = {
  command: 'redirect-refs',
  options: {
    filePattern: {
      defaultOption: true,
      type: String,
      defaultValue: '{**/*.md,**/*.html}'
    },
    prefixes: {
      alias: 'p',
      type: String,
      multiple: true
    },
    'main-branch': {
      defaultValue: 'master',
      alias: 'b',
      type: String
    },
    root: {
      alias: 'r',
      defaultValue: './',
      type: String
    },
    ignore: {
      alias: 'i',
      type: String,
      defaultValue: '**/node_modules/**/*.*'
    },
    quiet: {
      alias: 'q',
      type: Boolean,
      defaultValue: false
    },
    verbose: {
      alias: 'v',
      type: Boolean,
      defaultValue: false
    }
  },
  execute: async (
    {
      root,
      prefixes,
      'main-branch': mainBranch,
      filePattern,
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

    const files = await globAsync(filePattern, { ignore })

    const redirections = await Promise.all(files.map(async file => {
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

    console.log(`Redirected ${redirections.filter(Boolean).length} out of ${files.length} files `)
    return 0
  }
}
