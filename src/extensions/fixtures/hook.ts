import { Before } from '@cucumber/cucumber'
import { Fixtures } from '.'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export const install = (fixtures: Fixtures): void => {
    Before(function (scenarioInfos) {
        fixtures.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
