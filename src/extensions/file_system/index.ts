/**
 * @module extensions/FileSystem
 */

import * as fileSystemSteps from './file_system.steps'
import { Cli } from '../cli'

/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/FileSystem/FileSystem
 */

import path from 'path'
import { mkdirs, readFile, stat, Stats, remove as fsRemove } from 'fs-extra'

export class FileSystem {
    private static _instance: FileSystem

    public static getInstance(): FileSystem {
        return this._instance || (this._instance = new this())
    }

    /**
     * Loads file content.
     *
     * @param {string} cwd               - Current Working Directory
     * @param {string} file              - File name
     * @param {string} [encoding='utf8'] - Content encoding
     * @return {Promise.<string>} File content
     */
    static getFileContent(
        cwd: string,
        file: string,
        encoding: BufferEncoding = 'utf8'
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            readFile(path.join(cwd, file), (err, data) => {
                if (err) return reject(err)
                resolve(data.toString(encoding))
            })
        })
    }

    /**
     * Gets info about file/directory.
     *
     * @param {string} cwd  - Current Working Directory
     * @param {string} file - File name
     * @return {Promise.<fs.Stats|null>} File/directory info or null if file/directory does not exist
     */
    static getFileInfo(cwd: string, file: string): Promise<Stats | null> {
        return new Promise((resolve, reject) => {
            stat(path.join(cwd, file), (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') return resolve(null)
                    return reject(err)
                }

                resolve(stats)
            })
        })
    }

    /**
     * Creates a directory.
     *
     * @param {string} cwd       - Current Working Directory
     * @param {string} directory - Directory name
     * @return {Promise.<boolean>}
     */
    static async createDirectory(cwd: string, directory: string): Promise<void> {
        await mkdirs(path.join(cwd, directory))
    }

    /**
     * Removes a file or directory.
     *
     * @param {string} cwd             - Current Working Directory
     * @param {string} fileOrDirectory - File or directory name
     * @return {Promise.<boolean>}
     */
    static async remove(cwd: string, fileOrDirectory: string): Promise<void> {
        await fsRemove(path.join(cwd, fileOrDirectory))
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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this) // fileSystem extension requires cli extension
 *     fileSystem.extendWorld(this)
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
 * const { state, cli, fileSystem } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this) // fileSystem extension requires cli extension
 *     fileSystem.extendWorld(this)
 * })
 *
 * state.install()
 * cli.install()
 * fileSystem.install()
 */
export const install = (): void => {
    fileSystemSteps.install(Cli.getInstance())
}
