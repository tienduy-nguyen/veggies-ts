'use strict'

const Registry = require('../../core/registry')
const Loader = require('./fixtures_module')

module.exports = (world) => {
    world.fixtures = Loader()
    Registry.registerExtension(world, 'fixtures')
}
