import { FileSystem } from '.'
import { VeggiesWorld } from '../../core/core_types'
import { hasExtension, registerExtension } from '../../core/registry'

export function extendWorld(world: VeggiesWorld): void {
    if (!hasExtension(world, 'cli')) {
        throw new Error(
            `Unable to init "file_system" extension as it requires "cli" extension which is not installed`
        )
    }

    world.fileSystem = FileSystem.getInstance()
    registerExtension(world, 'file_system')
}
