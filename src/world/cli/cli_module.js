/**
 * Create a new isolated cli
 * @return {Cli}
 */
const { Cli } = require('../../extensions/cli/cli')

module.exports = function () {
    return Cli.getInstance()
}
