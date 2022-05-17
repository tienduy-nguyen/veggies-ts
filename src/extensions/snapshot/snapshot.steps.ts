import { DataTable, Then } from '@cucumber/cucumber'
import _ from 'lodash'
import { ObjectFieldSpec, VeggiesWorld } from '../../core/core_types'

export function install(world: VeggiesWorld): void {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, function (): void {
        world.snapshot?.expectToMatch(world.httpApi?.getResponse()?.body)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^response json body should match snapshot$/, function (table: DataTable): void {
        let spec = []
        if (table) {
            spec = table.hashes().map((fieldSpec) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                _.assign({}, fieldSpec, {
                    value: world.state?.populate(fieldSpec.value),
                })
            )
        }

        world.snapshot?.expectToMatchJson(world.httpApi?.getResponse()?.body, spec)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, function (type: string): void {
        world.snapshot?.expectToMatch(world.cli?.getOutput(type))
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(
        /^(stderr|stdout) json output should match snapshot$/,
        function (type: string, table: DataTable): void {
            let spec = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: world.state?.populate(fieldSpec.value),
                    })
                )
            }

            const output = JSON.parse(world.cli?.getOutput(type) || '')
            world.snapshot?.expectToMatchJson(output, spec)
        }
    )

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^file (.+) should match snapshot$/, async function (file: string): Promise<void> {
        const content = await world.fileSystem?.getFileContent(world.cli?.getCwd(), file)
        world.snapshot?.expectToMatch(content)
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(
        /^json file (.+) content should match snapshot$/,
        async function (file: string, table: DataTable): Promise<void> {
            let spec: ObjectFieldSpec[] = []
            if (table) {
                spec = table.hashes().map((fieldSpec) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    _.assign({}, fieldSpec, {
                        value: world.state?.populate(fieldSpec.value),
                    })
                )
            }

            const content =
                (await world.fileSystem?.getFileContent(world.cli?.getCwd(), file)) || ''
            const parsedContent = JSON.parse(content)
            world.snapshot?.expectToMatchJson(parsedContent, spec)
        }
    )
}
