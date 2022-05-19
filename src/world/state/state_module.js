const { State } = require('../../extensions/state/state')

/**
 * Create a new isolated state
 * @return {State}
 */
module.exports = function () {
    return State.getInstance()
}
