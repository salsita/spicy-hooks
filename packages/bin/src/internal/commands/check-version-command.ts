import { escapeRegExp } from 'lodash'

import { CommandDefinition } from '../types/command-definition'
import { PackageJsonFile, readAllPackageJsons } from '../types/workspaces'

interface CheckVersionOptions {
  version?: string
  root: string
}

interface VersionOccurrence {
  packageJson: PackageJsonFile
  path: string[]
  version: string
}

export const checkVersionCommand: CommandDefinition<CheckVersionOptions> = {
  command: 'check-version',
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
  execute: async ({ version: expectedVersion, root }) => {
    if (expectedVersion == null) {
      console.error('Missing expected version')
      return 1
    }
    const packageJsons = await readAllPackageJsons(root)

    const packageNames = packageJsons.map(packageJson => packageJson.contents.name)

    const occurrences: VersionOccurrence[] = [
      ...packageJsons
        .filter(packageJson => packageJson.contents.version != null)
        .map(packageJson => ({
          packageJson,
          path: ['version'],
          version: packageJson.contents.version!
        })),
      ...packageJsons.flatMap(packageJson =>
        ([
          ['dependencies', packageJson.contents.dependencies],
          ['devDependencies', packageJson.contents.devDependencies],
          ['peerDependencies', packageJson.contents.peerDependencies]
        ] as const)
          .flatMap(([path, deps]) => packageNames
            .filter(packageName => deps && packageName in deps)
            .map(packageName => ({
              packageJson,
              path: [path, packageName],
              version: deps![packageName]
            }))
          )
      )
    ]

    const expectedVersionPattern = new RegExp(`^[\\^~]?${escapeRegExp(expectedVersion)}$`)
    const invalidOccurrences = occurrences.filter(occurrence => !expectedVersionPattern.test(occurrence.version))
    if (invalidOccurrences.length > 0) {
      invalidOccurrences.forEach(invalidOccurrence => console.error(
        `Expected version ${expectedVersion} differs from actual: ${invalidOccurrence.version} at
  ${invalidOccurrence.path.join('.')} in
  ${invalidOccurrence.packageJson.file}`
      ))
      return 1
    } else {
      console.log(`All ${occurrences.length} occurrences match the expected version`)
      return 0
    }
  }
}
