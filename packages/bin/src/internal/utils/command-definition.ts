import { Synopsis, TypedOptionDefinitions } from './typed-command-line-arguments'

export interface CommandDefinition<T extends object> {
  command: string
  description?: string
  synopses?: Array<Synopsis<T>>
  options: TypedOptionDefinitions<T>
  execute: (options: T) => Promise<number>
}
