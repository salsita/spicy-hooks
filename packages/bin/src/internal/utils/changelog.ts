import { resolve } from 'path'
import { existsSync, readFile, writeFile } from 'fs-extra'
import { isTruthy } from '@spicy-hooks/utils'

import { Release } from './github'
import { WorkspacePackage } from './workspaces'
import { PackageJson } from './package-json'

export interface PackageChangelogPattern {
  pattern: string
  packageName?: string
  file?: string
}

export interface ChangelogSettings {
  separator: string
  patterns: PackageChangelogPattern[]
}

export function readSettings (packageJson: PackageJson) {
  const settings = packageJson.changelogs
  const missingKeys = [
    settings == null && 'changelogs',
    settings && settings.patterns == null && 'changelogs.patterns',
    settings && settings.separator == null && 'changelogs.separator',
    settings?.patterns?.some(entry => entry.pattern == null) === true && 'changelogs.patterns.pattern',
    settings?.patterns?.some(entry => entry.file == null && entry.packageName == null) === true && 'changelogs.patterns.(file|packageName)'
  ].filter(isTruthy)

  if (missingKeys.length > 0) {
    throw Error(`Missing ${missingKeys.map(key => `'${key}'`).join(', ')} key${missingKeys.length > 0 ? 's' : ''}`)
  }

  return settings!
}

function buildHeader (release: Release) {
  const versionNumber = release.name !== release.tag_name && release.tag_name
  const date = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  return `# ${release.name}\n_${[versionNumber, date].filter(Boolean).join(' - ')}_`
}

function buildChangelog (sections: string[], pattern: RegExp) {
  const filteredSections = sections
    .filter(section => pattern.test(section))
    .map(section => section.replace(pattern, '$1'))

  if (filteredSections.length > 0) {
    return filteredSections.join('\n')
  } else {
    return '* No significant change'
  }
}

async function prependChangelog (filename: string, header: string, text: string) {
  const previousText =
    existsSync(filename)
      ? await readFile(filename, 'utf-8')
      : ''
  await writeFile(filename, `${header}

${text}

${previousText}`)
}

function splitSections (markdown: string, separator: string) {
  return markdown
    .split(new RegExp(separator))
    .map((section, index) => index > 0 ? `## ${section}` : section)
}

export async function writeChangelogs (releaseDraft: Release, settings: ChangelogSettings, workspacePackages: WorkspacePackage[]) {
  const packagesByName = new Map(workspacePackages.map(workspacePackage => [workspacePackage.packageJson.name, workspacePackage]))

  const header = buildHeader(releaseDraft)
  const sections = splitSections(releaseDraft.body, settings.separator)

  await Promise.all(settings.patterns.map(packagePattern => {
    const pattern = new RegExp(packagePattern.pattern)
    let filename: string
    if (packagePattern.packageName != null) {
      const workspacePackage = packagesByName.get(packagePattern.packageName)
      if (!workspacePackage) {
        throw new Error(`Invalid package name '${packagePattern.packageName}'`)
      }
      filename = resolve(workspacePackage.path, 'CHANGELOG.md')
    } else {
      filename = resolve(workspacePackages[0].path, packagePattern.file!)
    }

    const text = buildChangelog(sections, pattern)
    return prependChangelog(filename, header, text)
  }))
}
