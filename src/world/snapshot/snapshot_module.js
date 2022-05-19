const { Snapshot } = require('../../extensions/snapshot/snapshot')

/**
 * Create a new isolated snapshot
 * @return {Snapshot}
 */
module.exports = function () {
    return Snapshot.getInstance()
}
