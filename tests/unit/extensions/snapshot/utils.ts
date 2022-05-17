import * as utils from '../../../../src/extensions/snapshot/utils'
import { createSandbox, SinonStub, stub } from 'sinon'
import * as fileSystem from '../../../../src/extensions/snapshot/file_system'
import { dedent } from '../../../../src/extensions/snapshot/dedent'
import { diff } from 'jest-diff'

jest.mock('jest-diff')
const diffMock = <jest.Mock<typeof diff>>(<unknown>diff)

describe('src > extensions > snapshot > utils', () => {
    describe('prefixSnapshots', () => {
        it('prefixSnapshots give a prefix per scenario name', () => {
            const scenarios = [
                { name: 'Scenario 1', line: 10 },
                { name: 'Scenario 2', line: 20 },
            ]

            const expectedResult = {
                10: { name: 'Scenario 1', line: 10, prefix: 'Scenario 1 1' },
                20: { name: 'Scenario 2', line: 20, prefix: 'Scenario 2 1' },
            }

            expect(utils.prefixSnapshots(scenarios)).toEqual(expectedResult)
        })

        it('prefixSnapshots works with duplicate scenarios names', () => {
            const scenarios = [
                { name: 'Scenario 1', line: 10 },
                { name: 'Scenario 2', line: 20 },
                { name: 'Scenario 1', line: 30 },
            ]

            const expectedResult = {
                10: { name: 'Scenario 1', line: 10, prefix: 'Scenario 1 1' },
                20: { name: 'Scenario 2', line: 20, prefix: 'Scenario 2 1' },
                30: { name: 'Scenario 1', line: 30, prefix: 'Scenario 1 2' },
            }

            expect(utils.prefixSnapshots(scenarios)).toEqual(expectedResult)
        })

        it('prefixSnapshots throw an error if no scenarios object', () => {
            expect(utils.prefixSnapshots).toThrowError(/Scenarios are required to prefix snapshots/)
        })
    })

    describe('extractScenarios', () => {
        let getFileContentStub: SinonStub
        beforeAll(() => {
            getFileContentStub = stub(fileSystem, 'getFileContent')
        })

        afterEach(() => getFileContentStub.reset())
        afterAll(() => getFileContentStub.restore())

        it('extractScenarios read scenarios names from a file', () => {
            const file = 'folder1/feature1.feature'

            const fileContent = `
        @cli @offline
        Feature: yarn CLI

            Scenario: Running an invalid command
                When I run command yarn invalid
                Then exit code should be 1
                And stderr should contain Command "invalid" not found.

            Scenario: Getting info about installed yarn version
                When I run command yarn --version
                Then exit code should be 0
                And stdout should match ^[0-9]{1}.[0-9]{1,3}.[0-9]{1,3}
                And stderr should be empty

            Scenario: Running an invalid command
                When I run command yarn invalid
                Then exit code should be 1
                And stderr should contain Command "invalid" not found.
    `

            const expectedContent = [
                { name: 'Running an invalid command', line: 5 },
                { name: 'Getting info about installed yarn version', line: 10 },
                { name: 'Running an invalid command', line: 16 },
            ]

            getFileContentStub.withArgs(file).returns(fileContent)

            expect(utils.extractScenarios(file)).toEqual(expectedContent)

            expect(getFileContentStub.calledOnce).toBeTruthy()
        })

        it('extractScenarios throw an error if no file', () => {
            expect(utils.extractScenarios).toThrowError(/Invalid feature file undefined/)
            expect(utils.extractScenarios).toThrowError(TypeError)
            expect(getFileContentStub.notCalled).toBeTruthy()
        })
    })

    describe('readSnapshotFile', () => {
        const sandbox = createSandbox()
        let getFileInfoStub: SinonStub, getFileContentStub: SinonStub

        beforeAll(() => {
            getFileInfoStub = sandbox.stub(fileSystem, 'getFileInfo')
            getFileContentStub = sandbox.stub(fileSystem, 'getFileContent')
        })

        afterEach(() => sandbox.reset())
        afterAll(() => sandbox.restore())

        it('should read and parse snapshot file', () => {
            const file = 'folder1/feature1.feature'

            const snapshotContent = dedent`
        """
        Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }
        """
    `

            const fileContent = dedent`
        """


        exports[\`scenario 1 1.1\`] = \`Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }\`;

        """
    `

            const expectedContent = { 'scenario 1 1.1': snapshotContent }

            getFileInfoStub.returns({})
            getFileContentStub.returns(fileContent)

            expect(utils.readSnapshotFile(file)).toEqual(expectedContent)

            expect(getFileInfoStub.calledWithExactly(file)).toBeTruthy()
            expect(getFileContentStub.calledWithExactly(file)).toBeTruthy()
        })

        it("should give an empty object if file doesn't exists", () => {
            const file = 'folder1/feature1.feature'

            const expectedContent = {}
            getFileInfoStub.returns(null)

            expect(utils.readSnapshotFile(file)).toEqual(expectedContent)

            expect(getFileInfoStub.calledWithExactly(file)).toBeTruthy()
            expect(getFileContentStub.notCalled).toBeTruthy()
        })

        it('readSnapshotFile throw an error if no file', () => {
            expect(utils.readSnapshotFile).toThrowError(
                /Missing snapshot file undefined to read snapshots/
            )
        })
    })

    describe('writeSnapshotFile', () => {
        let writeFileContentStub: SinonStub
        beforeAll(() => {
            writeFileContentStub = stub(fileSystem, 'writeFileContent')
        })

        afterAll(() => writeFileContentStub.restore())

        it('should format and write snapshot file', () => {
            const file = 'folder1/feature1.feature'

            const scenario1Snapshot = dedent`
        """
        Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }
        """
    `
            const contentToWrite = { 'scenario 1 1.1': scenario1Snapshot }

            const expectedWrite = dedent`
        """


        exports[\`scenario 1 1.1\`] = \`Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }\`;

        """
    `

            utils.writeSnapshotFile(file, contentToWrite)

            expect(writeFileContentStub.calledWithExactly(file, expectedWrite)).toBeTruthy()
        })
    })

    describe('snapshotsPath', () => {
        it('snapshotsPath returns snapshot path', () => {
            const featurePath = 'myfolder/featurefile.feature'
            const expectedPath = 'myfolder/__snapshots__/featurefile.feature.snap'
            const options = {}
            expect(utils.snapshotsPath(featurePath, options)).toEqual(expectedPath)
        })

        it('snapshotsPath returns snapshot path with overrided folder and extension', () => {
            const featurePath = 'myfolder/featurefile.feature'
            const expectedPath = 'myfolder/testsnap/featurefile.feature.sna'
            const options = {
                snapshotsDirname: 'testsnap',
                snapshotsFileExtension: 'sna',
            }
            expect(utils.snapshotsPath(featurePath, options)).toEqual(expectedPath)
        })
    })

    describe('diff', () => {
        afterEach(() => {
            diffMock.mockReset()
        })

        afterAll(() => {
            diffMock.mockRestore()
        })

        const diffOptions = {
            expand: false,
            aAnnotation: 'Snapshot',
            bAnnotation: 'Received',
        }

        test('return null when the diff message contains the NO_DIFF_MESSAGE value', () => {
            const expectedContent = `
            Object {
                "key1": "value1",
            }
        `

            const snapshotContent = `
            Object {
                "key1": "value1",
            }
        `

            const diffResult = `This         
             has
             nothing to do with the 
             result!
             -> Compared values have no visual difference. ¯\\_(ツ)_/¯
         `

            // @ts-ignore
            diffMock.mockReturnValue(diffResult)

            const diffMessage = utils.diff(snapshotContent, expectedContent)

            expect(diffMessage).toBeNull()

            expect(diff).toHaveBeenNthCalledWith(1, snapshotContent, expectedContent, diffOptions)
        })

        test('return a custom diff message when the diff message is not defined', () => {
            const expectedContent = 'a'

            const snapshotContent = 'b'

            // @ts-ignore
            diffMock.mockReturnValue(undefined)

            const diffMessage = utils.diff(snapshotContent, expectedContent)

            const expectedDiffMessage = '\n\u001b[32m- a\u001b[39m \n \u001b[31m+ b\u001b[39m'

            expect(diffMessage).toEqual(expectedDiffMessage)
        })

        test('return the diff message', () => {
            const snapshotContent = `
            Object {
                "key1": "value1",
                "key2": "value2",
                "key3": "value3",
                "key4": "value4",
                "key5": "value5",
            }
        `

            const expectedContent = `
            Object {
                "key1": "value1",
                "key2": "value6",
                "key3": "value3",
                "key4": "value7",
                "key5": "value5",
            }
        `

            const diffResult = `
            """

            \u001b[32m- Snapshot\u001b[39m
            \u001b[31m+ Received\u001b[39m


            \u001b[2m          Object {\u001b[22m
            \u001b[2m              "key1": "value1",\u001b[22m
            \u001b[32m-             "key2": "value2",\u001b[39m
            \u001b[31m+             "key2": "value6",\u001b[39m
            \u001b[2m              "key3": "value3",\u001b[22m
            \u001b[32m-             "key4": "value4",\u001b[39m
            \u001b[31m+             "key4": "value7",\u001b[39m
            \u001b[2m              "key5": "value5",\u001b[22m
            \u001b[2m          }\u001b[22m
            \u001b[2m      \u001b[22m
            """
        `

            // @ts-ignore
            diffMock.mockReturnValue(diffResult)

            const expectedDiffMessage = `\n${diffResult}`

            const diffMessage = utils.diff(snapshotContent, expectedContent)

            expect(diffMessage).toEqual(expectedDiffMessage)
        })
    })

    describe('formatSnapshotFile', () => {
        it('formatSnapshotFile should format snapshot file content', () => {
            const content = {
                ['scenario 1 1.1']: 'some content',
                ['scenario 2 1.1']: 'another content',
            }

            const expected = dedent`
        """
        
        
        exports[\`scenario 1 1.1\`] = \`some content\`;

        exports[\`scenario 2 1.1\`] = \`another content\`;
        
        """
    `

            expect(utils.formatSnapshotFile(content)).toEqual(expected)
        })

        it('formatSnapshotFile should format snapshot file content, sort by keys and escape back ticks', () => {
            const content = {
                ['scenario` 1 1.1']: 'some` content`',
                ['scenario 2 1.1']: 'another content',
            }

            const expected = dedent`
        """
        
        
        exports[\`scenario 2 1.1\`] = \`another content\`;

        exports[\`scenario\\\` 1 1.1\`] = \`some\\\` content\\\`\`;
        
        """
    `

            expect(utils.formatSnapshotFile(content)).toEqual(expected)
        })

        test('formatSnapshotFile should normalize new lines', () => {
            const content = {
                ['scenario 1 1.1']: 'some content\rnewline content\r\n',
                ['scenario 2 1.1']: 'another content',
            }

            const expected = dedent`
    """
    
    
    exports[\`scenario 1 1.1\`] = \`some content
    newline content
    \`;

    exports[\`scenario 2 1.1\`] = \`another content\`;
    
    """
    `

            expect(utils.formatSnapshotFile(content)).toEqual(expected)
        })
    })

    describe('parseSnapshotFile', () => {
        it('parseSnapshotFile should parse snapshot file content', () => {
            const content = dedent`
        """
        \n
        exports[\`scenario 1 1.1\`] = \`some content\`;

        exports[\`scenario 2 1.1\`] = \`another content\`;\n
        """
    `

            const expected = {
                ['scenario 1 1.1']: 'some content',
                ['scenario 2 1.1']: 'another content',
            }

            expect(utils.parseSnapshotFile(content)).toEqual(expected)
        })
    })
})
