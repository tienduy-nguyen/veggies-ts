import { DataTable, Then } from '@cucumber/cucumber'
import _ from 'lodash'
import { ObjectFieldSpec, VeggiesWorld } from '../../core/core_types'

export function install(): void {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, function (this: VeggiesWorld): void {
        this.snapshot?.expectToMatch(this.httpApi?.getResponse()?.body)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^response json body should match snapshot$/,
        function (this: VeggiesWorld, table: DataTable): void {
            let spec = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: this.state?.populate(fieldSpec.value),
                    })
                )
            }

            this.snapshot?.expectToMatchJson(this.httpApi?.getResponse()?.body, spec)
        }
    )

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(
        /^(stderr|stdout) output should match snapshot$/,
        function (this: VeggiesWorld, type: string): void {
            this.snapshot?.expectToMatch(this.cli?.getOutput(type))
        }
    )

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^(stderr|stdout) json output should match snapshot$/,
        function (this: VeggiesWorld, type: string, table: DataTable): void {
            let spec = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: this.state?.populate(fieldSpec.value),
                    })
                )
            }

            const output = JSON.parse(this.cli?.getOutput(type) || '')
            this.snapshot?.expectToMatchJson(output, spec)
        }
    )

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^file (.+) should match snapshot$/,
        async function (this: VeggiesWorld, file: string): Promise<void> {
            const content = await this.fileSystem?.getFileContent(this.cli?.getCwd(), file)
            this.snapshot?.expectToMatch(content)
        }
    )

    /**
     * Checking that a file content matches the snapshot
     */
    Then(
        /^json file (.+) content should match snapshot$/,
        async function (this: VeggiesWorld, file: string, table: DataTable): Promise<void> {
            let spec: ObjectFieldSpec[] = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: this.state?.populate(fieldSpec.value),
                    })
                )
            }

            const content = (await this.fileSystem?.getFileContent(this.cli?.getCwd(), file)) || ''
            const parsedContent = JSON.parse(content)
            this.snapshot?.expectToMatchJson(parsedContent, spec)
        }
    )
}
