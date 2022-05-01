import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'
import { HttpApiClient } from './http_api'

export const extendWorld = (world: VeggiesWorld): void => {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApiClient = HttpApiClient.getInstance()
    registerExtension(world, 'http_api')
}
