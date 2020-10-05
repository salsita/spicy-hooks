import { CommandDefinition } from '../utils/command-definition'
import { readAllPackages, writeAllPackages } from '../utils/workspaces'
import { setVersion } from '../utils/version'

interface SetVersionOptions {
  version?: string
  root: string
}

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
      type: String,
      defaultValue: './'
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
