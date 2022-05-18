/**
 * @module extensions/state
 */

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
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
 * const { state } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
 *
 *     // install definitions steps
 *     state.install(this)
 * })
 *
 */
import stateSteps = require('./state.steps')
export function install(): void {
    stateSteps.install()
}
