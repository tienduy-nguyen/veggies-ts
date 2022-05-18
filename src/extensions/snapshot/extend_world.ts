import { registerExtension } from '../../core/registry'
import { VeggiesWorld } from '../../core/core_types'
import { Snapshot } from './snapshot'

function extendWorld(world: VeggiesWorld): void {
    world.snapshot = Snapshot.getInstance()
    registerExtension(world, 'snapshot')
}
export = extendWorld
