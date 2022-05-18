/**
 * @module extensions/Cli
 */

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, cli } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this)
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
 * const { state, cli } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // cli extension requires state extension
 *     cli.extendWorld(this)
 *
 * })
 * // install definition steps
 * state.install()
 * cli.install()
 *
 */
import cliSteps = require('./cli.steps')
export function install(): void {
    cliSteps.install()
}
