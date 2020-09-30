import { readFile } from 'fs-extra'

export type Dependencies = Record<string, string>

export interface PackageJson {
  name: string
  version?: string
  workspaces?: {
    packages: string[]
  }
  dependencies?: Dependencies
  devDependencies?: Dependencies
  peerDependencies?: Dependencies
}

export async function readPackageJson (file: string): Promise<PackageJson> {
  return JSON.parse(await readFile(file, 'utf-8'))
}
