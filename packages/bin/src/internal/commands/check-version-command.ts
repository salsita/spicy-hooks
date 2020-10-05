import { escapeRegExp } from 'lodash'

import { CommandDefinition } from '../utils/command-definition'
import { WorkspacePackage, readAllPackages } from '../utils/workspaces'

interface CheckVersionOptions {
  version?: string
  root: string
}

interface VersionOccurrence {
  workspacePackage: WorkspacePackage
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
      type: String,
      defaultValue: './'
    }
  },
  execute: async ({ version: expectedVersion, root }) => {
    if (expectedVersion == null) {
      console.error('Missing expected version')
      return 1
    }
    const workspacePackages = await readAllPackages(root)

    const packageNames = workspacePackages.map(workspacePackage => workspacePackage.packageJson.name)

    const occurrences: VersionOccurrence[] = [
      ...workspacePackages
        .filter(workspacePackage => workspacePackage.packageJson.version != null)
        .map(workspacePackage => ({
          workspacePackage: workspacePackage,
          path: ['version'],
          version: workspacePackage.packageJson.version!
        })),
      ...workspacePackages.flatMap(workspacePackage =>
        ([
          ['dependencies', workspacePackage.packageJson.dependencies],
          ['devDependencies', workspacePackage.packageJson.devDependencies],
          ['peerDependencies', workspacePackage.packageJson.peerDependencies]
        ] as const)
          .flatMap(([path, deps]) => packageNames
            .filter(packageName => deps && packageName in deps)
            .map(packageName => ({
              workspacePackage: workspacePackage,
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
  ${invalidOccurrence.workspacePackage.path}`
      ))
      return 1
    } else {
      console.log(`All ${occurrences.length} occurrences match the expected version`)
      return 0
    }
  }
}
