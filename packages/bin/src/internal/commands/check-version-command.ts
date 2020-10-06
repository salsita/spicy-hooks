import { resolve } from 'path'
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
  description: `Checks whether the {bold version} property in {bold package.json} of every workspace package matches the specified value.
                When a workspace package specifies another one as a dependency, version range of the dependency is checked as well.`,
  options: {
    version: {
      defaultOption: true,
      multiple: false,
      type: String,
      typeLabel: '{underline semver}',
      description: 'Semantic version (i.e. <major>.<minor>.<patch>) expected to appear in all {bold package.json}s'
    },
    root: {
      alias: 'r',
      type: String,
      typeLabel: '{underline path}',
      defaultValue: './',
      description: `Path to the root package (i.e. directory where the root {bold package.json} is located)
                    (defaults to './')`
    }
  },
  execute: async ({ version: expectedVersion, root }) => {
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
  ${resolve(invalidOccurrence.workspacePackage.path, 'package.json')}`
      ))
      return 1
    } else {
      console.log(`All ${occurrences.length} occurrences match the expected version`)
      return 0
    }
  }
}
