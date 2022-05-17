/**
 * @module extensions/state
 */

import * as stateSteps from './state.steps'

import _ from 'lodash'
import { CastedValue } from '../../core/core_types'

/**
 * State extension.
 *
 * @class
 */
export class State {
    public collections: Record<string, string | undefined>

    private static _instance: State
    private constructor() {
        this.collections = {}
    }

    public static getInstance(): State {
        return this._instance || (this._instance = new this())
    }

    /**
     * Sets value for given key.
     *
     * @param {string} key   - The key you wish to set a value for
     * @param {*}      value - The value
     */
    set(key: string, value?: CastedValue): void {
        _.set(this.collections, key, value)
    }

    /**
     * Retrieves a value for given key.
     *
     * @param {string} key - The key you wish to retrieve a value for
     * @return {*}
     */
    get(key: string): string | undefined {
        return _.get(this.collections, key)
    }

    /**
     * Clear the state
     */
    clear(): void {
        this.collections = {}
    }

    /**
     * Dump state content
     * @return {Object|{}|*}
     */
    dump(): Record<string, string | undefined> {
        return this.collections
    }

    populate(value: string): string {
        return _.template(value, { interpolate: /{{([\s\S]+?)}}/g })(this.collections)
    }

    populateObject(object: Record<string, string>): Record<string, string> {
        return _.mapValues(object, (value) => this.populate(value))
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
 * const { state } = require('veggies-ts')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this)
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
export function install(): void {
    stateSteps.install()
}
