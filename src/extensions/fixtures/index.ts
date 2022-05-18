/**
 * @module extensions/fixtures
 */

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { fixtures } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
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
 * const { fixtures } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     fixtures.extendWorld(this)
 * })
 *  // install definition steps
 *  fixtures.install()
 *
 */
import hook = require('./hook')
export function install(): void {
    hook.install()
}
