/**
 * @module extensions/httpApi
 */

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
import extendWorld = require('./extend_world')
export { extendWorld }

/**
 * The http API configuration object.
 *
 * @typedef {Object} HttpApiConfig
 * @property {string} [baseUrl=''] - The base url used for all http calls
 */

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 * // install definitions steps
 * state.install()
 * httpApi.install({ baseUrl: 'http://localhost:3000' })
 *
 * @param {baseUrl} string
 */
import httpApiSteps = require('./http_api.steps')
export function install({ baseUrl = '' } = {}): void {
    httpApiSteps.install({
        baseUrl,
    })
}
