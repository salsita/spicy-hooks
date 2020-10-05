import { isTruthy } from '@spicy-hooks/utils'

import { WorkspacePackage } from './workspaces'

const versionRangePattern = /^([\^~]?).+$/

export function setVersion (version: string, workspacePackages: WorkspacePackage[]) {
  const packageNames = workspacePackages.map(workspacePackage => workspacePackage.packageJson.name)

  workspacePackages.forEach(workspacePackage => {
    if (workspacePackage.packageJson.version != null) {
      workspacePackage.packageJson.version = version
    }
  })

  const allDependencies = workspacePackages.flatMap(workspacePackage => [
    workspacePackage.packageJson.dependencies,
    workspacePackage.packageJson.devDependencies,
    workspacePackage.packageJson.peerDependencies
  ]).filter(isTruthy)

  allDependencies.forEach(dependencyList => {
    packageNames.forEach(packageName => {
      if (packageName in dependencyList) {
        const matches = versionRangePattern.exec(dependencyList[packageName])
        if (!matches) {
          throw new Error(`Unsupported version range format: ${dependencyList[packageName]}`)
        }
        dependencyList[packageName] = `${matches[1]}${version}`
      }
    })
  })
}
