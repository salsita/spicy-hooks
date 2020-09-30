import { writeFile } from 'fs-extra'
import { isTruthy } from '@spicy-hooks/utils'

import { CommandDefinition } from '../utils/command-definition'
import { readAllPackageJsons } from '../utils/workspaces'

interface SetVersionOptions {
  version?: string
  root: string
}

const versionPattern = /^([\^~]?).+$/

export const setVersionCommand: CommandDefinition<SetVersionOptions> = {
  command: 'set-version',
  options: {
    version: {
      defaultOption: true,
      multiple: false,
      type: String
    },
    root: {
      alias: 'r',
      multiple: false,
      type: String,
      defaultValue: './'
    }
  },
  execute: async ({ version, root }) => {
    if (version == null) {
      console.error('Missing target version')
      return 1
    }
    const packageJsons = await readAllPackageJsons(root)

    const packageNames = packageJsons.map(packageJson => packageJson.contents.name)

    packageJsons.forEach(packageJson => {
      if (packageJson.contents.version != null) {
        packageJson.contents.version = version
      }
    })

    const allDependencies = packageJsons.flatMap(packageJson => [
      packageJson.contents.dependencies,
      packageJson.contents.devDependencies,
      packageJson.contents.peerDependencies
    ]).filter(isTruthy)

    allDependencies.forEach(dependencyList => {
      packageNames.forEach(packageName => {
        if (packageName in dependencyList) {
          const matches = versionPattern.exec(dependencyList[packageName])
          if (!matches) {
            console.error(`Unsupported version range format: ${dependencyList[packageName]}`)
            return 0
          }
          dependencyList[packageName] = `${matches[1]}${version}`
        }
      })
    })

    await Promise.all(packageJsons.map(packageJson => writeFile(packageJson.file, JSON.stringify(packageJson.contents, null, 2) + '\n')))
    return 0
  }
}
