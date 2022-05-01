import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'
import { Fixtures } from './fixtures'

export const extendWorld = (world: VeggiesWorld): void => {
    world.fixtures = Fixtures.getInstance()
    registerExtension(world, 'fixtures')
}
