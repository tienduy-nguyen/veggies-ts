/**
 * Create a new isolated httpApi
 * @return {HttpApi}
 */
const { HttpApi } = require('../../extensions/http_api/http_api')

module.exports = function () {
    return HttpApi.getInstance()
}
