import { Given, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import { Cli } from '../cli'
import { FileSystem } from './index'

export const install = (cli: Cli): void => {
    /**
     * Creating a directory.
     */
    Given(/^(?:I )?create directory (.+)$/, function (directory: string) {
        return FileSystem.createDirectory(cli.getCwd(), directory)
    })

    /**
     * Remove a file or directory.
     */
    Given(/^(?:I )?remove (?:file|directory) (.+)$/, function (fileOrDirectory: string) {
        return FileSystem.remove(cli.getCwd(), fileOrDirectory)
    })

    /**
     * Checking file/directory presence.
     */
    Then(
        /^(file|directory) (.+) should (not )?exist$/,
        function (type: string, file: string, flag: string) {
            return FileSystem.getFileInfo(cli.getCwd(), file).then((info) => {
                if (flag === 'not ') {
                    expect(info, `${type} '${file}' exists`).to.be.null
                } else {
                    expect(info, `${type} '${file}' does not exist`).not.to.be.null
                    if (type === 'file') {
                        expect(info?.isFile(), `'${file}' is not a file`).to.be.true
                    } else {
                        expect(info?.isDirectory(), `'${file}' is not a directory`).to.be.true
                    }
                }
            })
        }
    )

    /**
     * Checking file content.
     */
    Then(
        /^file (.+) content should (not )?(equal|contain|match) (.+)$/,
        function (file: string, flag: string, comparator: string, expectedValue: string) {
            return FileSystem.getFileContent(cli.getCwd(), file)
                .then((content) => {
                    let expectFn = expect(
                        content,
                        `Expected file '${file}' to ${
                            flag ? flag : ''
                        }${comparator} '${expectedValue}', but found '${content}' which does${
                            flag ? '' : ' not'
                        }`
                    ).to
                    if (flag != undefined) {
                        expectFn = expectFn.not
                    }

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    expectFn[comparator](
                        comparator === 'match' ? new RegExp(expectedValue) : expectedValue
                    )
                })
                .catch((err: NodeJS.ErrnoException) => {
                    if (err.code === 'ENOENT')
                        return expect.fail('', '', `File '${file}' should exist`)

                    return Promise.reject(err)
                })
        }
    )
}