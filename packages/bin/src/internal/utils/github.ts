import { ReposListReleasesResponseData } from '@octokit/types'
import { Octokit } from '@octokit/core'

import { PackageJson } from './package-json'

export type Release = ReposListReleasesResponseData[0]

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

export async function findLatestReleaseDraft (targetBranchName: string, repository: GitHubRepository): Promise<Release | undefined> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  const { owner, repo } = repository
  const { data: releases } = await octokit.request('GET /repos/:owner/:repo/releases', {
    owner,
    repo
  })
  return releases.find(release => release.draft && release.target_commitish === targetBranchName)
}
