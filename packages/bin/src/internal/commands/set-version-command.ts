import { CommandDefinition } from '../utils/command-definition'
import { readAllPackages, writeAllPackages } from '../utils/workspaces'
import { setVersion } from '../utils/version'

interface SetVersionOptions {
  version?: string
  root: string
}

export const setVersionCommand: CommandDefinition<SetVersionOptions> = {
  command: 'set-version',
  description: `Sets a {bold version} property in {bold package.json} of every workspace package to the specified value.
                When a workspace package specifies another one as a dependency, version range of the dependency updated as well.`,
  options: {
    version: {
      defaultOption: true,
      multiple: false,
      type: String,
      typeLabel: '{underline semver}',
      description: 'Semantic version (i.e. <major>.<minor>.<patch>) to replace any previous version in all {bold package.json}s'
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
  execute: async ({ version, root }) => {
    if (version == null) {
      console.error('Missing target version')
      return 1
    }
    const workspacePackages = await readAllPackages(root)
    setVersion(version, workspacePackages)
    await writeAllPackages(workspacePackages)

    return 0
  }
}
