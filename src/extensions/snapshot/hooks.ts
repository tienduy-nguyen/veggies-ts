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

export const install = (world: VeggiesWorld): void => {
    Before(function (scenarioInfos) {
        const file = scenarioInfos.gherkinDocument.uri
        const line = getCurrentScenarioLineNumber(scenarioInfos)

        if (world.snapshot?.featureFile) world.snapshot.featureFile = file || ''
        if (world.snapshot?.scenarioLine) world.snapshot.scenarioLine = line ?? -1
    })

    BeforeAll(function () {
        clean.resetReferences()
    })

    AfterAll(function () {
        if (cmdOptions.cleanSnapshots) clean.cleanSnapshots()
        statistics.printReport()
    })
}
