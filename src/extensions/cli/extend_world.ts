import { Cli } from '.'
import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'

export function extendWorld(world: VeggiesWorld): void {
    if (!hasExtension(world, 'state')) {
        throw new Error(
            `Unable to init "cli" extension as it requires "state" extension which is not installed`
        )
    }

    world.cli = Cli.getInstance()
    registerExtension(world, 'cli')
}
