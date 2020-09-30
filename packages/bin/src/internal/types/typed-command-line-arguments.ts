import commandLineArgs, { OptionDefinition, ParseOptions } from 'command-line-args'

export interface TypedOptionDefinitionMultiple<T> extends Omit<OptionDefinition, 'name' | 'group'> {
  multiple: true
  type: (input: string) => T
  defaultValue?: T[]
}

export interface TypedOptionDefinitionSingle<T> extends Omit<OptionDefinition, 'name' | 'group'> {
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
