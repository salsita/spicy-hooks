import commandLineArgs, { OptionDefinition, ParseOptions } from 'command-line-args'
import commandLineUsage, { Section, OptionDefinition as UsageOptionDefinition } from 'command-line-usage'
import { isTruthy } from '@spicy-hooks/utils'
import { bold } from 'chalk'

interface ExtendedUsageOptionDefinition extends UsageOptionDefinition {
  required?: boolean
}

export interface BaseTypedOptionDefinition extends Omit<OptionDefinition, 'name' | 'group'> {
  description?: string
  typeLabel?: string
  required?: boolean
}

export interface TypedOptionDefinitionMultiple<T> extends BaseTypedOptionDefinition {
  multiple: true
  type: (input: string) => T
  defaultValue?: T[]
}

export interface TypedOptionDefinitionSingle<T> extends BaseTypedOptionDefinition {
  multiple?: false
  type: (input: string) => T
  defaultValue?: T
}

export type TypedOptionDefinitions<T extends object> = {
  [K in keyof T]: T[K] extends any[]
    ? TypedOptionDefinitionMultiple<T[K][0]>
    : TypedOptionDefinitionSingle<T[K]>
}

export type WithUnknown<T> = T & { _unknown?: string[] }

export function typedCommandLineArgs<T extends object> (typedDefinition: TypedOptionDefinitions<T>, parseOptions?: ParseOptions): WithUnknown<T> {
  const optionDefinitions: OptionDefinition[] = Object.entries(typedDefinition as TypedOptionDefinitions<any>).map(([name, definition]) => ({
    name,
    ...definition
  }))
  return commandLineArgs(optionDefinitions, parseOptions) as WithUnknown<T>
}

export function isRequired (option: BaseTypedOptionDefinition) {
  return option.required ?? (option.defaultValue === undefined && option.type !== Boolean)
}

function formatSynopsisOption (option: ExtendedUsageOptionDefinition) {
  const label = `{bold --${option.name}}`
  const optionalLabel = option.defaultOption === true
    ? `[${label}]`
    : label
  const type = option.typeLabel != null
    ? option.typeLabel
    : `{underline ${option.type.name.toLowerCase()}}`
  const multiType = option.multiple === true || option.lazyMultiple === true
    ? `${type} ...`
    : type
  const labelWithType = option.type === Boolean
    ? optionalLabel
    : `${optionalLabel} ${multiType}`
  return isRequired(option)
    ? labelWithType
    : `[${labelWithType}]`
}

export type Synopsis<T extends Object> = Array<keyof T>

export interface UsageGuideOptions<T extends Object> {
  command: string
  typedDefinition: TypedOptionDefinitions<T>
  precedingSections?: Section[]
  followingSections?: Section[]
  synopses?: Array<Synopsis<T>>
}

export function generateUsageGuide<T extends object> (
  {
    command,
    typedDefinition,
    precedingSections = [],
    followingSections = [],
    synopses = [Object.keys(typedDefinition) as Array<keyof T>]
  }: UsageGuideOptions<T>
) {
  const optionList: UsageOptionDefinition[] = Object.entries(typedDefinition as TypedOptionDefinitions<any>).map(([name, definition]) => ({
    name,
    ...definition,
    typeLabel: definition.typeLabel
  }))

  const formattedSynopses = synopses.map(synopsis => synopsis.map(key => formatSynopsisOption({
    name: key as string,
    ...typedDefinition[key]
  })))

  const concatenatedSynopses = formattedSynopses.map(synopsis => `${command} ${synopsis.join(' ')}`)

  return commandLineUsage([
    ...precedingSections,
    {
      header: 'Synopsis',
      content: concatenatedSynopses
    },
    {
      header: 'Options',
      optionList
    },
    ...followingSections
  ].filter(isTruthy))
}

export function validateOptions<T extends object> (definitions: TypedOptionDefinitions<T>, options: T): boolean {
  const missingOptionNames = Object.entries(definitions as TypedOptionDefinitions<any>)
    .filter(([name, definition]) =>
      isRequired(definition) && options[name as keyof T] === undefined
    )
    .map(([name]) => name)

  if (missingOptionNames.length > 0) {
    console.error(`Missing required option${missingOptionNames.length > 1 ? 's' : ''}: ${missingOptionNames.map(name => bold(`--${name}`)).join(', ')}`)
    return false
  }
  return true
}
