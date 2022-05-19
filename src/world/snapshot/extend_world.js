'use strict'

const Registry = require('../../core/registry')
const snapshot = require('./snapshot_module')

module.exports = (world) => {
    world.snapshot = snapshot()
    Registry.registerExtension(world, 'snapshot')
}
