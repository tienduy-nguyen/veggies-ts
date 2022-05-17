import { Given, When } from '@cucumber/cucumber'
import * as Cast from '../../core/cast'
import { VeggiesWorld } from '../../core/core_types'

export function install(): void {
    Given(
        /^(?:I )?set state (.+) to (.+)$/,
        function (this: VeggiesWorld, key: string, value: string) {
            this.state?.set(key, Cast.value(value))
        }
    )

    When(/^(?:I )?clear state$/, function (this: VeggiesWorld) {
        this.state?.clear()
    })

    When(/^(?:I )?dump state$/, function (this: VeggiesWorld) {
        console.log(this.state?.dump()) // eslint-disable-line no-console
    })
}
