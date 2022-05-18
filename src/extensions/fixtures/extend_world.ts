import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'
import { Fixtures } from './fixtures'

function extendWorld(world: VeggiesWorld): void {
    world.fixtures = Fixtures.getInstance()
    registerExtension(world, 'fixtures')
}

export = extendWorld
