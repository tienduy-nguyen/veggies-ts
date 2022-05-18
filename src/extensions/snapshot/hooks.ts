import { Before, BeforeAll, AfterAll } from '@cucumber/cucumber'

import * as clean from './clean'
import * as cmdOptions from './cmdOptions'
import { ScenarioInfos } from './snapshot_types'
import * as statistics from './statistics'
import { VeggiesWorld } from '../../core/core_types'

export const getCurrentScenarioLineNumber = (scenarioInfos: ScenarioInfos): number | undefined => {
    const currentScenarioId = scenarioInfos.pickle.astNodeIds[0]
    const scenarioChild = scenarioInfos.gherkinDocument.feature?.children.find(
        (child) => child.scenario?.id === currentScenarioId
    )
    return scenarioChild?.scenario?.location.line
}

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export function install(): void {
    Before(function (this: VeggiesWorld, scenarioInfos) {
        const file = scenarioInfos.gherkinDocument.uri
        const line = getCurrentScenarioLineNumber(scenarioInfos)

        if (this.snapshot) {
            this.snapshot.featureFile = file || ''
            this.snapshot.scenarioLine = line ?? -1
        }
    })

    BeforeAll(function (this: VeggiesWorld) {
        clean.resetReferences()
    })

    AfterAll(function (this: VeggiesWorld) {
        if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
        statistics.printReport()
    })
}
