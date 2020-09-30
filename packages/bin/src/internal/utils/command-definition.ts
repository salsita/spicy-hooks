import { TypedOptionDefinitions } from './typed-command-line-arguments'

export interface CommandDefinition<T extends object> {
  command: string
  options: TypedOptionDefinitions<T>
  execute: (options: T) => Promise<number>
}
