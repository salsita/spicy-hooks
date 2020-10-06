import { CommandDefinition } from '../utils/command-definition'
import { getCurrentBranchName } from '../utils/git'
import { findLatestReleaseDraft, getGitHubRepository } from '../utils/github'
import { readAllPackages, writeAllPackages } from '../utils/workspaces'
import { writeChangelogs, readSettings } from '../utils/changelog'
import { setVersion } from '../utils/version'

const versionPattern = /^v(.+)$/

interface PrepareReleasesOptions {
  root: string
  token?: string
}

export const prepareReleaseCommand: CommandDefinition<PrepareReleasesOptions> = {
  command: 'prepare-release',
  description: `Pulls latest release draft linked to the current Git branch from GitHub and:

                - distributes changes from the release notes into appropriate change logs
                  (based on {bold changelogs} property within the root {bold package.json}) 

                - sets versions within {bold package.json} of every workspace package to value specified in the release  
                  (see the {bold spicy set-version --help} for more info)

                Changes generated by this command are meant to be committed and pushed to the repository prior publishing the release.`,
  options: {
    token: {
      alias: 't',
      type: String,
      typeLabel: '<github-token>',
      defaultValue: process.env.GITHUB_TOKEN,
      required: false,
      description: `GitHub repo token to list the latest releases from a private repository
                    (defaults to {bold $GITHUB_TOKEN} env)`
    },
    root: {
      alias: 'r',
      type: String,
      typeLabel: '{underline path}',
      defaultValue: './',
      description: `Path to the root package (i.e. directory where the root {bold package.json} is located)
                    (defaults to {bold './'})`
    }
  },
  execute: async ({ root, token }) => {
    const branchName = await getCurrentBranchName()
    const workspacePackages = await readAllPackages(root)
    const rootPackage = workspacePackages[0]

    const repo = getGitHubRepository(rootPackage.packageJson)
    const draft = await findLatestReleaseDraft(branchName, repo, token)
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
