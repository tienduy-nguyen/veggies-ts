const { Fixtures } = require('../../extensions/fixtures/fixtures')

/**
 * Create a new isolated fixtures
 * @return {Fixtures}
 */
module.exports = function () {
    return Fixtures.getInstance()
}
