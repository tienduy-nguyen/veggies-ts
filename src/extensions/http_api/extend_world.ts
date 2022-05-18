import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'
import { HttpApi } from './http_api'

function extendWorld(world: VeggiesWorld): void {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "http_api" extension as it requires "state" extension which is not installed`
        )
    }

    world.httpApi = HttpApi.getInstance()
    registerExtension(world, 'http_api')
}
export = extendWorld
