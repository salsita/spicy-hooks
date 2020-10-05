import { CommandDefinition } from '../utils/command-definition'
import { getCurrentBranchName } from '../utils/git'
import { findLatestReleaseDraft, getGitHubRepository } from '../utils/github'
import { readAllPackages, writeAllPackages } from '../utils/workspaces'
import { writeChangelogs, readSettings } from '../utils/changelog'
import { setVersion } from '../utils/version'

const versionPattern = /^v(.+)$/

interface PrepareReleasesOptions {
  root: string
}

export const prepareReleaseCommand: CommandDefinition<PrepareReleasesOptions> = {
  command: 'prepare-release',
  options: {
    root: {
      alias: 'r',
      type: String,
      defaultValue: './'
    }
  },
  execute: async ({ root }) => {
    const branchName = await getCurrentBranchName()
    const workspacePackages = await readAllPackages(root)
    const rootPackage = workspacePackages[0]

    const repo = getGitHubRepository(rootPackage.packageJson)
    const draft = await findLatestReleaseDraft(branchName, repo)
    if (draft === undefined) {
      throw new Error(`No release drafted for branch '${branchName}'`)
    }

    const [, version] = versionPattern.exec(draft.tag_name) ?? []
    if (version === undefined) {
      throw new Error(`Invalid version number ${draft.tag_name}`)
    }

    console.log(`Preparing release ${draft.name} from '${branchName}'...`)

    const settings = readSettings(rootPackage.packageJson)

    await setVersion(version, workspacePackages)
    await writeChangelogs(draft, settings, workspacePackages)
    await writeAllPackages(workspacePackages)

    console.log(`Release ${draft.name} prepared for publishing... commit and push your changes!`)
    return 0
  }
}
