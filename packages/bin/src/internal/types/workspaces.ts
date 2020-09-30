import { resolve } from 'path'
import { promisify } from 'util'
import { glob } from 'glob'

import { PackageJson, readPackageJson } from './package-json'

const globAsync = promisify(glob)

export interface PackageJsonFile {
  file: string
  contents: PackageJson
}

export async function readAllPackageJsons (workspaceRoot: string): Promise<PackageJsonFile[]> {
  const rootDir = resolve(workspaceRoot)
  const rootPackageJsonFile = resolve(rootDir, 'package.json')
  const rootPackageJson = await readPackageJson(rootPackageJsonFile)
  const workspacePatterns = rootPackageJson.workspaces?.packages ?? []

  const resolvedPatterns = await Promise.all(
    workspacePatterns.map(pattern => globAsync(pattern, { cwd: rootDir }))
  )
  const workspaces = resolvedPatterns.flat()

  const workspacePackageJsons: PackageJsonFile[] = await Promise.all(workspaces.map(async path => {
    const file = resolve(path, 'package.json')
    return {
      file,
      contents: await readPackageJson(file)
    }
  }))

  return [
    { file: rootPackageJsonFile, contents: rootPackageJson },
    ...workspacePackageJsons
  ]
}
