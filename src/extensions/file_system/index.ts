/**
 * @module extensions/FileSystem
 */

import * as fileSystemSteps from './file_system.steps'

/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/FileSystem/FileSystem
 */

import path from 'path'
import { mkdirs, readFile, stat, Stats, remove as fsRemove } from 'fs-extra'
import { FalsyString } from '../../core/core_types'

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
    getFileContent(
        cwd: FalsyString,
        file: string,
        encoding: BufferEncoding = 'utf8'
    ): Promise<string | undefined> {
        if (!cwd) return Promise.resolve(undefined)

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
     * @return {Promise.<fs.Stats|undefined>} File/directory info or undefined if file/directory does not exist
     */
    getFileInfo(cwd: FalsyString, file: string): Promise<Stats | undefined> {
        if (!cwd) return Promise.resolve(undefined)
        return new Promise((resolve, reject) => {
            stat(path.join(cwd, file), (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') return resolve(undefined)
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
    async createDirectory(cwd: FalsyString, directory: string): Promise<void> {
        if (cwd) await mkdirs(path.join(cwd, directory))
    }

    /**
     * Removes a file or directory.
     *
     * @param {string} cwd             - Current Working Directory
     * @param {string} fileOrDirectory - File or directory name
     * @return {Promise.<boolean>}
     */
    async remove(cwd: FalsyString, fileOrDirectory: string): Promise<void> {
        if (cwd) await fsRemove(path.join(cwd, fileOrDirectory))
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
 * const { state, cli, fileSystem } = require('veggies-ts')
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
 * const { state, cli, fileSystem } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this) // fileSystem extension requires cli extension
 *     fileSystem.extendWorld(this)
 *
 * })
 * // install definition steps
 *  state.install()
 *  cli.install()
 *  fileSystem.install()
 *
 */
export function install(): void {
    fileSystemSteps.install()
}
