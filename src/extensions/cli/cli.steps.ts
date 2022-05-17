import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { expect } from 'chai'
import { VeggiesWorld } from '../../core/core_types'

export function install(): void {
    Given(
        /^(?:I )?set (?:working directory|cwd) to (.+)$/,
        function (this: VeggiesWorld, cwd: string) {
            this.cli?.setCwd(cwd)
        }
    )

    Given(
        /^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/,
        function (this: VeggiesWorld, name: string, value: string) {
            this.cli?.setEnvironmentVariable(name, value)
        }
    )

    Given(
        /^(?:I )?set (?:env|environment) (?:vars|variables)$/,
        function (this: VeggiesWorld, step: DataTable) {
            this.cli?.setEnvironmentVariables(step.rowsHash())
        }
    )

    Given(
        /^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/,
        function (
            this: VeggiesWorld,
            signal: number | NodeJS.Signals,
            _delay: number,
            unit: string
        ) {
            let delay = Number(_delay)
            if (unit === 's') {
                delay = delay * 1000
            }

            this.cli?.scheduleKillProcess(delay, signal)
        }
    )

    When(/^(?:I )?run command (.+)$/, function (this: VeggiesWorld, command: string) {
        return this.cli?.run(command)
    })

    When(/^(?:I )?dump (stderr|stdout)$/, function (this: VeggiesWorld, type: string) {
        const output = this.cli?.getOutput(type)
        console.log(output) // eslint-disable-line no-console
    })

    Then(
        /^(?:the )?(?:command )?exit code should be (\d+)$/,
        function (this: VeggiesWorld, expectedExitCode: string | number) {
            const exitCode = this.cli?.getExitCode() ?? -1

            expect(
                exitCode,
                `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`
            ).to.equal(Number(expectedExitCode))
        }
    )

    Then(/^(stderr|stdout) should be empty$/, function (this: VeggiesWorld, type: string) {
        const output = this.cli?.getOutput(type)

        expect(output).to.be.empty
    })

    Then(
        /^(stderr|stdout) should contain (.+)$/,
        function (this: VeggiesWorld, type: string, expected: string) {
            const output = this.cli?.getOutput(type)

            expect(output).to.contain(expected)
        }
    )

    Then(
        /^(stderr|stdout) should not contain (.+)$/,
        function (this: VeggiesWorld, type: string, expected: string) {
            const output = this.cli?.getOutput(type)

            expect(output).to.not.contain(expected)
        }
    )

    Then(
        /^(stderr|stdout) should match (.+)$/,
        function (this: VeggiesWorld, type: string, regex: RegExp | string) {
            const output = this.cli?.getOutput(type)

            expect(output).to.match(new RegExp(regex, 'gim'))
        }
    )

    Then(
        /^(stderr|stdout) should not match (.+)$/,
        function (this: VeggiesWorld, type: string, regex: RegExp | string) {
            const output = this.cli?.getOutput(type)

            expect(output).to.not.match(new RegExp(regex, 'gim'))
        }
    )
}
