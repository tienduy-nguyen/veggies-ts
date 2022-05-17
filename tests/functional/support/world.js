const { setWorldConstructor } = require('@cucumber/cucumber')
const { cli, snapshot, state } = require('../../../lib')

setWorldConstructor(function () {
    state.extendWorld(this)
    cli.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
cli.install()
snapshot.install()
