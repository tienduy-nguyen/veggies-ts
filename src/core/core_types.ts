import { World } from '@cucumber/cucumber'
import { State } from '../extensions/state'
import { Fixtures } from '../extensions/fixtures'
import { HttpApi } from '../extensions/http_api'
import { Snapshot } from '../extensions/snapshot'
import { FileSystem } from '../extensions/file_system'
import { Cli } from '../extensions/cli'

export type CastFunctions = Record<string, CastFunction>

export interface CastFunction {
    (value?: string | null): CastedValue | undefined
}

export type CastedValue =
    | string
    | number
    | boolean
    | object
    | (string | number | boolean | object)[]
    | null
    | undefined

export type CastType = 'string' | 'boolean' | 'number' | 'date' | 'array' | 'null' | 'undefined'

export type VeggiesWorld = Partial<World> & {
    _registredExtensions?: string[]
    state?: State
    fixtures?: Fixtures
    fileSystem?: FileSystem
    cli?: Cli
    httpApi?: HttpApi
    snapshot?: Snapshot
}

export type MatchingRule = {
    name: symbol
    isNegated: boolean
}

export type ObjectFieldSpec = {
    field?: string
    matcher?: string
    value?: string
}
