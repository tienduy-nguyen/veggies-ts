/**
 * @module extensions/FileSystem
 */

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
import extendWorld = require('./extend_world')
export { extendWorld }

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
import fileSystemSteps = require('./file_system.steps')
export function install(): void {
    fileSystemSteps.install()
}
