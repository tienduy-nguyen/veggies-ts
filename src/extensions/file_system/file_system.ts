import path from 'path'
import { mkdirs, readFile, stat, Stats, remove as fsRemove } from 'fs-extra'
import { FalsyString } from '../../core/core_types'

/**
 * Loads file content.
 *
 * @param {string} cwd               - Current Working Directory
 * @param {string} file              - File name
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {Promise.<string>} File content
 */
export function getFileContent(
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
export function getFileInfo(cwd: FalsyString, file: string): Promise<Stats | undefined> {
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
export async function createDirectory(cwd: FalsyString, directory: string): Promise<void> {
    if (cwd) await mkdirs(path.join(cwd, directory))
}

/**
 * Removes a file or directory.
 *
 * @param {string} cwd             - Current Working Directory
 * @param {string} fileOrDirectory - File or directory name
 * @return {Promise.<boolean>}
 */
export async function remove(cwd: FalsyString, fileOrDirectory: string): Promise<void> {
    if (cwd) await fsRemove(path.join(cwd, fileOrDirectory))
}
