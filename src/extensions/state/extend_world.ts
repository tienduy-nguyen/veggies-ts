import { State } from '.'
import { VeggiesWorld } from '../../core/core_types'
import { registerExtension } from '../../core/registry'

export function extendWorld(world: VeggiesWorld): void {
    world.state = State.getInstance()
    registerExtension(world, 'state')
}
