import { Given, When } from '@cucumber/cucumber'
import * as Cast from '../../core/cast'
import { VeggiesWorld } from '../../core/core_types'

export const install = (world: VeggiesWorld): void => {
    Given(/^(?:I )?set state (.+) to (.+)$/, function (key: string, value: string) {
        world.state?.set(key, Cast.value(value))
    })

    When(/^(?:I )?clear state$/, function () {
        world.state?.clear()
    })

    When(/^(?:I )?dump state$/, function () {
        console.log(world.state?.dump()) // eslint-disable-line no-console
    })
}
