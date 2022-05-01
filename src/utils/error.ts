import { CleanError } from './utils_types'
import { isObject } from './type_guards'

export const getCleanError = (error: unknown): CleanError => {
    if (isObject(error)) return { ...error, message: error.message as string }

    if (typeof error === 'string') return { message: error }

    if (!error) return { message: 'unknown error' }

    return { message: JSON.stringify(error) }
}
