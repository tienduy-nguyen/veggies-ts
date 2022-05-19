import { spawn } from 'child_process'
import path from 'path'

export class Cli {
    public cwd: string
    public env: Record<string, string>
    public killSignal: number | NodeJS.Signals | undefined
    public killDelay: number
    public exitCode: number | undefined
    public stdout: string
    public stderr: string

    private static _instance: Cli
    private constructor() {
        this.cwd = process.cwd()
        this.env = {}
        this.killSignal = undefined
        this.killDelay = 0
        this.exitCode = undefined
        this.stdout = ''
        this.stderr = ''
    }

    public static getInstance(): Cli {
        return this._instance || (this._instance = new this())
    }

    /**
     * Sets the Current Working Directory for the command.
     *
     * @param {string} cwd - The new CWD
     */
    setCwd(cwd: string): void {
        if (cwd.indexOf('/') === 0) {
            this.cwd = cwd
        } else {
            this.cwd = path.join(process.cwd(), cwd)
        }
    }

    /**
     * Returns Current Working Directory.
     *
     * @return {string}
     */
    getCwd(): string {
        return this.cwd
    }

    /**
     * Defines environment variables.
     * Beware that all existing ones will be overridden!
     *
     * @param {Object} env - The environment variables object
     */
    setEnvironmentVariables(env: Record<string, string>): void {
        this.env = env
    }

    /**
     * Defines a single environment variable.
     *
     * @param {string} name  - The environment variable name
     * @param {string} value - The value associated to the variable
     */
    setEnvironmentVariable(name: string, value: string): void {
        this.env[name] = value
    }

    scheduleKillProcess(delay: number, signal: number | NodeJS.Signals): void {
        this.killDelay = delay
        this.killSignal = signal
    }

    /**
     * Returns latest command execution exit code.
     *
     * @return {number} The exit code
     */
    getExitCode(): number | undefined {
        return this.exitCode
    }

    /**
     * Returns captured output.
     *
     * @throws {TypeError} Argument `type` must be one of: 'stdout', 'stderr'
     * @param {string} [type=stdout] - The standard stream type
     * @returns {string} The captured output
     */
    getOutput(type = 'stdout'): string {
        if (type === 'stdout') return this.stdout
        else if (type === 'stderr') return this.stderr

        throw new TypeError(`invalid output type '${type}', must be one of: 'stdout', 'stderr'`)
    }

    /**
     * Resets the Cli helper:
     * - CWD is reset to current process CWD
     * - environment variables
     * - killDelay & killSignal are disabled
     * - exitCode is set to undefined
     * - stdout is set to an empty string
     * - stderr is set to an empty string
     */
    reset(): void {
        this.cwd = process.cwd()
        this.env = {}
        this.killDelay = 0
        this.killSignal = undefined
        this.exitCode = undefined
        this.stdout = ''
        this.stderr = ''
    }

    /**
     * Run given command.
     *
     * @param {string} rawCommand - The command string
     * @returns {Promise.<boolean>} The resulting `Promise`
     */
    run(rawCommand: string): Promise<void> {
        const [command, ...args] = rawCommand.split(' ')

        return new Promise((resolve, reject) => {
            // we inherit from current env vars
            // otherwise, we can have problem with PATH
            const cmd = spawn(command || '', args, {
                cwd: this.cwd,
                env: { ...process.env, ...this.env },
            })

            let killer: NodeJS.Timeout | undefined
            let killed = false
            if (this.killSignal !== undefined) {
                killer = setTimeout(() => {
                    cmd.kill(this.killSignal ?? undefined)
                    killed = true
                }, this.killDelay)
            }

            const cmdStdout: Uint8Array[] = []
            const cmdStderr: Uint8Array[] = []

            cmd.stdout.on('data', cmdStdout.push.bind(cmdStdout))
            cmd.stderr.on('data', cmdStderr.push.bind(cmdStderr))

            cmd.on('close', (code) => {
                if (killer !== undefined) {
                    if (!killed) {
                        clearTimeout(killer)

                        return reject(
                            new Error(
                                `process.kill('${
                                    this.killSignal || ''
                                }') scheduled but process exited (delay: ${this.killDelay}ms)`
                            )
                        )
                    }
                }

                this.exitCode = code ?? undefined

                this.stdout = Buffer.concat(cmdStdout).toString()
                this.stderr = Buffer.concat(cmdStderr).toString()

                resolve()
            })
        })
    }
}