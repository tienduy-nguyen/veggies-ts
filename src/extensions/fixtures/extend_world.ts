import { Fixtures } from '.'
import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'

export const extendWorld = (world: VeggiesWorld): void => {
    world.fixtures = Fixtures.getInstance()
    registerExtension(world, 'fixtures')
}
