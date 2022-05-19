'use strict'

const Registry = require('../../core/registry')
const State = require('./state_module')

module.exports = (world) => {
    world.state = State()
    Registry.registerExtension(world, 'state')
}
