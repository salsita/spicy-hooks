import { PackageJson } from './package-json'

export interface GitHubRepository {
  owner: string
  repo: string
  directory?: string
}

const repositoryPattern = /^https:\/\/github.com\/([^/]+)\/(.+)\.git$/

export function getGitHubRepository (packageJson: PackageJson): GitHubRepository {
  if (!packageJson.repository) {
    throw new Error('Missing \'repository\' key')
  }
  if (!packageJson.repository.url) {
    throw new Error('Missing \'repository.url\' key')
  }
  const [, owner, repo] = repositoryPattern.exec(packageJson.repository.url) ?? []
  if (owner == null || repo == null) {
    throw new Error('Property \'repository.url\' must be in \'https://github.com/<owner>/<repo>.git\' form')
  }
  return {
    owner,
    repo,
    directory: packageJson.repository.directory
  }
}
