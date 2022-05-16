/**
 * @module extensions/fixtures
 */

import * as hook from './hook'
import fs from 'fs'
import { getCleanError } from '../../utils/error'
import path from 'path'
import _ from 'lodash'
import glob from 'fast-glob'
import { load } from 'js-yaml'

export class Fixtures {
    public fixturesDir: string
    public featureUri?: string

    private static _instance: Fixtures
    private constructor({ fixturesDir }: { fixturesDir: string }) {
        this.fixturesDir = fixturesDir
        this.featureUri = undefined
    }

    public static getInstance({ fixturesDir } = { fixturesDir: 'fixtures' }): Fixtures {
        return this._instance || (this._instance = new this({ fixturesDir }))
    }

    /**
     * Configures the loader
     *
     * @param {string} [fixturesDir='fixtures'] - The name of the fixtures directory relative to feature
     */
    configure({ fixturesDir } = { fixturesDir: 'fixtures' }): void {
        this.fixturesDir = fixturesDir
    }

    /**
     * Sets feature uri, used to resolve fixtures files.
     * When trying to load a fixture file the path will be comprised of:
     * - feature uri
     * - fixturesDir
     * - fixture name
     *
     * @param {string} featureUri - Feature uri
     */
    setFeatureUri(featureUri?: string): void {
        this.featureUri = featureUri
    }

    /**
     * Loads content from file.
     *
     * @param {string} file - File path
     * @return {Promise.<string>} File content
     */
    loadText(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) return reject(err)
                resolve(data.toString('utf8'))
            })
        })
    }

    /**
     * Loads content from yaml file.
     *
     * @param {string} file - File path
     * @return {Promise.<Object|Array>} Parsed yaml data
     */
    async loadYaml(file: string): Promise<unknown> {
        const content = await this.loadText(file)
        try {
            const data = load(content)
            if (data === undefined)
                return Promise.reject(
                    new Error(
                        `Fixture file is invalid, yaml parsing resulted in undefined data for file: ${file}`
                    )
                )

            return data
        } catch (err) {
            throw new Error(
                `Unable to parse yaml fixture file: ${file}.\nerror: ${getCleanError(err).message}`
            )
        }
    }

    /**
     * Loads content from json file.
     *
     * @param {string} file - File path
     * @return {Promise.<Object>} Json data
     */
    loadJson(file: string): Promise<Record<string, unknown>> {
        return this.loadText(file).then((content) => {
            try {
                return JSON.parse(content) as Record<string, unknown>
            } catch (err) {
                throw new Error(
                    `Unable to parse json fixture file: ${file}.\nerror: ${
                        getCleanError(err).message
                    }`
                )
            }
        })
    }

    /**
     * Loads content from javascript module.
     *
     * @param {string} file - File path
     * @return {Promise.<*>} Data generated from the module
     */
    loadModule(file: string): Promise<unknown> {
        try {
            const relativePath = path.relative(__dirname, file)
            // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
            const mod = require(relativePath)

            if (!_.isFunction(mod)) {
                return Promise.reject(
                    new Error(
                        [
                            `javascript fixture file should export default function.\n`,
                            `Make sure you declared 'module.exports = <function>' in ${file}`,
                        ].join('')
                    )
                )
            }

            return Promise.resolve(mod())
        } catch (err) {
            return Promise.reject(
                new Error(
                    `An error occurred while loading fixture file: ${file}\nerror: ${
                        getCleanError(err).message
                    }`
                )
            )
        }
    }

    /**
     * Tries to load a fixture from current feature directory.
     * Will search for the following file extensions:
     * - yaml
     * - yml
     * - js
     * - json
     * - txt
     *
     * @param {string} fixture - Fixture file name without extension
     * @return {Promise.<Object|string>} Fixture content
     */
    async load(fixture: string): Promise<unknown> {
        if (this.featureUri === undefined)
            return Promise.reject(
                new Error(`Cannot load fixture: ${fixture}, no feature uri defined`)
            )

        const featureDir = path.dirname(this.featureUri)
        const pattern = `${featureDir}/${this.fixturesDir}/${fixture}.@(yaml|yml|js|json|txt)`

        const files = await glob(pattern)

        const fixturesCount = files.length

        if (fixturesCount === 0) throw new Error(`No fixture found for: ${fixture} (${pattern})`)
        if (fixturesCount > 1)
            throw new Error(
                [
                    `Found ${fixturesCount} matching fixture files, `,
                    `you should have only one matching '${fixture}', matches:\n  `,
                    `- ${files.join('\n  - ')}`,
                ].join('')
            )

        const fixtureFile = files[0] || ''
        const ext = path.extname(fixtureFile).substring(1)

        switch (ext) {
            case 'yml':
            case 'yaml':
                return this.loadYaml(fixtureFile)

            case 'js':
                return this.loadModule(fixtureFile)

            case 'json':
                return this.loadJson(fixtureFile)

            default:
                return this.loadText(fixtureFile)
        }
    }

    /**
     * Resets fixtures loader.
     */
    reset(): void {
        this.featureUri = undefined
    }
}

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
export { extendWorld } from './extend_world'

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { fixtures } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
 * })
 *
 * fixtures.install(defineSupportCode)
 */
export const install = (): void => {
    hook.install(Fixtures.getInstance())
}
