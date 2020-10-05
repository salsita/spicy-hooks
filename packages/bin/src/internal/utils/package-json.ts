import { readFile, writeFile } from 'fs-extra'

import { ChangelogSettings } from './changelog'

export type Dependencies = Record<string, string>

export interface Repository {
  type: string
  url: string
  directory?: string
}

export interface PackageJson {
  name: string
  version?: string
  workspaces?: {
    packages: string[]
  }
  repository?: Repository
  dependencies?: Dependencies
  devDependencies?: Dependencies
  peerDependencies?: Dependencies
  changelogs?: ChangelogSettings
}

export async function readPackageJson (file: string): Promise<PackageJson> {
  return JSON.parse(await readFile(file, 'utf-8'))
}

export async function writePackageJson (file: string, packageJson: PackageJson): Promise<void> {
  return writeFile(file, JSON.stringify(packageJson, null, 2) + '\n')
}
