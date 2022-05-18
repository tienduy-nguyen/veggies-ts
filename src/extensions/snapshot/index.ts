/**
 * @module extensions/snapshot
 */

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { snapshot } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
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
 * const { snapshot } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     snapshot.extendWorld(this)
 * })
 * // install definitions
 * snapshot.install(this)
 *
 */
import snapshotSteps = require('./snapshot.steps')
import hooks = require('./hooks')
export function install(): void {
    hooks.install()
    snapshotSteps.install()
}
