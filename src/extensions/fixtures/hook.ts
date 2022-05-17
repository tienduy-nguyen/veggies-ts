import { Before } from '@cucumber/cucumber'
import { VeggiesWorld } from '../../core/core_types'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export const install = (world: VeggiesWorld): void => {
    Before(function (scenarioInfos) {
        world.fixtures?.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
