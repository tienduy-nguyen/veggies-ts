import { Given, When } from '@cucumber/cucumber'
import { State } from '.'
import * as Cast from '../../core/cast'

export const install = (state: State): void => {
    Given(/^(?:I )?set state (.+) to (.+)$/, function (key: string, value: string) {
        state.set(key, Cast.value(value))
    })

    When(/^(?:I )?clear state$/, function () {
        state.clear()
    })

    When(/^(?:I )?dump state$/, function () {
        console.log(state.dump()) // eslint-disable-line no-console
    })
}
