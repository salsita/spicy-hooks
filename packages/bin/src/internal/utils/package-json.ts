import { readFile } from 'fs/promises'

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
}

export async function readPackageJson (file: string): Promise<PackageJson> {
  return JSON.parse(await readFile(file, 'utf-8'))
}
