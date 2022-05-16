import { HttpApi } from '.'
import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'

export const extendWorld = (world: VeggiesWorld): void => {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApi = HttpApi.getInstance()
    registerExtension(world, 'http_api')
}
