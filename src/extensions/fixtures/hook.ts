import { Before } from '@cucumber/cucumber'
import { VeggiesWorld } from '../../core/core_types'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export function install(): void {
    Before(function (this: VeggiesWorld, scenarioInfos) {
        this.fixtures?.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
