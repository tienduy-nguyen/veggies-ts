export type CleanError = {
    code?: string
    stack?: string
    message: string
} & Record<string, unknown>
