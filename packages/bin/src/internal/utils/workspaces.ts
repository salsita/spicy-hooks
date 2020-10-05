import { resolve } from 'path'
import { promisify } from 'util'
import { glob } from 'glob'

import { PackageJson, readPackageJson, writePackageJson } from './package-json'

const globAsync = promisify(glob)

export interface WorkspacePackage {
  path: string
  packageJson: PackageJson
}

export async function readAllPackages (workspaceRoot: string): Promise<WorkspacePackage[]> {
  const rootDir = resolve(workspaceRoot)
  const rootPackageJsonFile = resolve(rootDir, 'package.json')
  const rootPackageJson = await readPackageJson(rootPackageJsonFile)
  const workspacePatterns = rootPackageJson.workspaces?.packages ?? []

  const resolvedPatterns = await Promise.all(
    workspacePatterns.map(pattern => globAsync(pattern, { cwd: rootDir }))
  )
  const workspaces = resolvedPatterns.flat()

  const workspacePackageJsons: WorkspacePackage[] = await Promise.all(workspaces.map(async path => {
    const file = resolve(path, 'package.json')
    return {
      path,
      packageJson: await readPackageJson(file)
    }
  }))

  return [
    { path: rootDir, packageJson: rootPackageJson },
    ...workspacePackageJsons
  ]
}

export async function writeAllPackages (workspacePackages: WorkspacePackage[]): Promise<void> {
  await Promise.all(workspacePackages.map(workspacePackage => writePackageJson(resolve(workspacePackage.path, 'package.json'), workspacePackage.packageJson)))
}
