import { resolve } from 'path'
import { existsSync, readFile, writeFile } from 'fs-extra'
import { isTruthy } from '@spicy-hooks/utils'

import { Release } from './github'
import { PackageJson } from './package-json'

export interface ChangelogMapping {
  pattern: string
  file: string
}

export interface ChangelogSettings {
  separator: string
  mappings: ChangelogMapping[]
}

export function readSettings (packageJson: PackageJson) {
  const settings = packageJson.changelogs
  const missingKeys = [
    settings == null && 'changelogs',
    settings && settings.mappings == null && 'changelogs.mappings',
    settings && settings.separator == null && 'changelogs.separator',
    settings?.mappings?.some(entry => entry.pattern == null) === true && 'changelogs.mappings.pattern',
    settings?.mappings?.some(entry => entry.file == null) === true && 'changelogs.mappings.file'
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

export function buildChangelog (sections: string[], pattern: RegExp) {
  const filteredSections = sections
    .filter(section => pattern.test(section))
    .map(section => section.replace(pattern, (...args) =>
      args.slice(1, args.length - 2).join('')
    ))

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
}

export async function writeChangelogs (releaseDraft: Release, settings: ChangelogSettings, rootPath: string) {
  const header = buildHeader(releaseDraft)
  const sections = splitSections(releaseDraft.body, settings.separator)

  await Promise.all(settings.mappings.map(mapping => {
    const pattern = new RegExp(mapping.pattern)
    const filename = resolve(rootPath, mapping.file)

    const text = buildChangelog(sections, pattern)
    return prependChangelog(filename, header, text)
  }))
}
