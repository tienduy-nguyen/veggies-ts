import { registerExtension } from '../../core/registry'
import { VeggiesWorld } from '../../core/core_types'
import { SnapshotOptions } from '../..'
import * as cmdOptions from './cmdOptions'
import { Snapshot } from '.'

export const extendWorld = (world: VeggiesWorld, options?: SnapshotOptions): void => {
    options = { ...cmdOptions, ...options }

    world.snapshot = Snapshot.getInstance(options)
    registerExtension(world, 'snapshot')
}
