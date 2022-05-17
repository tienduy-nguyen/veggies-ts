import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { inspect } from 'util'
import { expect } from 'chai'
import _ from 'lodash'
import * as Cast from '../../core/cast'
import { assertObjectMatchSpec } from '../../core/assertions'
import { STATUS_CODES } from 'http'
import { parseMatchExpression } from './utils'
import { Cookie } from 'tough-cookie'
import Properties = Cookie.Properties
import { Response } from 'request'
import { HttpApi } from './index'
import { VeggiesWorld } from '../../core/core_types'

const STATUS_MESSAGES = _.values(STATUS_CODES).map(_.lowerCase)

/**
 * Ensures there's a response available and returns it.
 *
 * @param {Object} client
 */
const mustGetResponse = (client?: HttpApi): Response | undefined => {
    const response = client?.getResponse()
    expect(response, 'No response available').to.not.be.empty

    return response || undefined
}

export const install = (world: VeggiesWorld, { baseUrl = '' } = {}): void => {
    /**
     * Setting http headers
     */
    Given(/^(?:I )?set request headers$/, function (step: DataTable) {
        const headers = Cast.object(world.state?.populateObject(step.rowsHash()))
        if (headers) world.httpApi?.setHeaders(headers)
    })

    /**
     * Setting http option followRedirect to false
     */
    Given(/^(?:I )?do not follow redirect$/, function () {
        world.httpApi?.setFollowRedirect(false)
    })

    /**
     * Setting http option followRedirect to true
     */
    Given(/^(?:I )?follow redirect$/, function () {
        world.httpApi?.setFollowRedirect(true)
    })

    /**
     * Assign http headers
     * The difference from "set request headers" is that "set" set the whole headers object
     * "assign" replace or set the given headers, keeping untouched the ones already set
     */
    Given(/^(?:I )?assign request headers$/, function (step: DataTable) {
        const headers = Cast.object(world.state?.populateObject(step.rowsHash()))
        _.each(headers, (value, key) => world.httpApi?.setHeader(key, value))
    })

    /**
     * Setting a single http header
     */
    Given(
        /^(?:I )?set ([a-zA-Z0-9-_]+) request header to (.+)$/,
        function (key: string, value: string) {
            world.httpApi?.setHeader(key, Cast.value(world.state?.populate(value)))
        }
    )

    /**
     * Clearing headers
     */
    Given(/^(?:I )?clear request headers/, function () {
        world.httpApi?.clearHeaders()
    })

    /**
     * Setting json payload
     */
    Given(/^(?:I )?set request json body$/, function (step: DataTable) {
        const body = Cast.object(world.state?.populateObject(step.rowsHash()))
        if (body) world.httpApi?.setJsonBody(body)
    })

    /**
     * Setting json payload from fixture file
     */
    Given(/^(?:I )?set request json body from (.+)$/, function (fixture: string) {
        return world.fixtures?.load(fixture).then((data: object) => {
            world.httpApi?.setJsonBody(data)
        })
    })

    /**
     * Setting form data
     */
    Given(/^(?:I )?set request form body$/, function (step: DataTable) {
        const body = Cast.object(world.state?.populateObject(step.rowsHash()))
        if (body) world.httpApi?.setFormBody(body)
    })

    /**
     * Setting form data from fixture file
     */
    Given(/^(?:I )?set request form body from (.+)$/, function (fixture: string) {
        return world.fixtures?.load(fixture).then((data: object) => {
            world.httpApi?.setFormBody(data)
        })
    })

    /**
     * Setting multipart data from fixture file
     */
    Given(/^(?:I )?set request multipart body from (.+)$/, function (fixture: string) {
        return world.fixtures?.load(fixture).then((data: object) => {
            world.httpApi?.setMultipartBody(data)
        })
    })

    /**
     * Clearing body
     */
    Given(/^(?:I )?clear request body$/, function () {
        world.httpApi?.clearBody()
    })

    /**
     * Setting query parameters
     */
    Given(/^(?:I )?set request query$/, function (step: DataTable) {
        const query = Cast.object(world.state?.populateObject(step.rowsHash()))
        if (query) world.httpApi?.setQuery(query)
    })

    /**
     * Pick a value from previous json response or header and set it to state
     */
    Given(
        /^(?:I )?pick response (json|header) (.+) as (.+)$/,
        function (dataSource: string, path: string, key: string) {
            const response = world.httpApi?.getResponse()
            const data = dataSource !== 'header' ? response?.body : response?.headers

            world.state?.set(key, _.get(data, path))
        }
    )

    /**
     * Replace placeholder of url
     */
    Given(
        /^(?:I )?replace(?: placeholder)? (.+) in (.+) to ([^\s]+)(?: with regex options? (.+)?)?$/,
        function (search: string, key: string, replaceValue: string, option?: string) {
            const newValue = world.state
                ?.get(key)
                ?.replace(new RegExp(search, option || undefined), replaceValue)

            world.state?.set(key, newValue)
        }
    )

    /**
     * Enabling cookies
     */
    Given(/^(?:I )?enable cookies$/, function () {
        world.httpApi?.enableCookies()
    })

    /**
     * Disabling cookies
     */
    Given(/^(?:I )?disable cookies$/, function () {
        world.httpApi?.disableCookies()
    })

    /**
     * Setting a cookie from fixture file
     */
    Given(/^(?:I )?set cookie from (.+)$/, function (fixture: string) {
        return world.fixtures?.load(fixture).then((cookie: Properties) => {
            world.httpApi?.setCookie(cookie)
        })
    })

    /**
     * Clearing client request cookies
     */
    Given(/^(?:I )?clear request cookies$/, function () {
        world.httpApi?.clearRequestCookies()
    })

    /**
     * Resetting the client's state
     */
    When(/^(?:I )?reset http client$/, function () {
        world.httpApi?.reset()
    })

    /**
     * Performing a request
     */
    When(/^(?:I )?(GET|POST|PUT|DELETE|PATCH) (.+)$/, function (method: string, path: string) {
        return world.httpApi?.makeRequest(method, world.state?.populate(path) || '', baseUrl)
    })

    /**
     * Dumping response body
     */
    When(/^(?:I )?dump response body$/, function () {
        const response = mustGetResponse(world.httpApi)
        console.log(inspect(response?.body, { colors: true, depth: null })) // eslint-disable-line no-console
    })

    /**
     * Dumping response headers
     */
    When(/^(?:I )?dump response headers$/, function () {
        const response = mustGetResponse(world.httpApi)
        console.log(response?.headers) // eslint-disable-line no-console
    })

    /**
     * Dumping response cookies
     */
    When(/^(?:I )?dump response cookies$/, function () {
        mustGetResponse(world.httpApi)
        console.log(world.httpApi?.getCookies())
    })

    /**
     * Checking response status code
     */
    Then(/^response status code should be ([1-5]\d\d)$/, function (statusCode: number) {
        const response = mustGetResponse(world.httpApi)
        expect(
            response?.statusCode,
            `Expected status code to be: ${statusCode}, but found: ${
                response?.statusCode ?? 'unknown'
            }`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response status by message
     */
    Then(/^response status should be (.+)$/, function (statusMessage: string) {
        if (!STATUS_MESSAGES.includes(_.lowerCase(statusMessage))) {
            throw new TypeError(`'${statusMessage}' is not a valid status message`)
        }

        const response = mustGetResponse(world.httpApi)
        const statusCode = _.findKey(STATUS_CODES, (msg) => _.lowerCase(msg) === statusMessage)
        const statusCodeResponse = response?.statusCode ?? 0
        const currentStatusMessage =
            STATUS_CODES[`${statusCodeResponse}`] || `${statusCodeResponse}`

        expect(
            statusCodeResponse,
            `Expected status to be: '${statusMessage}', but found: '${_.lowerCase(
                currentStatusMessage
            )}'`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response cookie is present|absent
     */
    Then(/^response should (not )?have an? (.+) cookie$/, function (flag: string, key: string) {
        const cookie = world.httpApi?.getCookie(key)

        if (flag == undefined) {
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.null
        } else {
            expect(cookie, `A cookie exists for key '${key}'`).to.be.null
        }
    })

    /**
     * Checking response cookie is|isn't secure
     */
    Then(/^response (.+) cookie should (not )?be secure$/, function (key: string, flag: string) {
        const cookie = world.httpApi?.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag == undefined) {
            expect(cookie?.secure, `Cookie '${key}' is not secure`).to.be.true
        } else {
            expect(cookie?.secure, `Cookie '${key}' is secure`).to.be.false
        }
    })

    /**
     * Checking response cookie httpOnly
     */
    Then(/^response (.+) cookie should (not )?be http only$/, function (key: string, flag: string) {
        const cookie = world.httpApi?.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag == undefined) {
            expect(cookie?.httpOnly, `Cookie '${key}' is not http only`).to.be.true
        } else {
            expect(cookie?.httpOnly, `Cookie '${key}' is http only`).to.be.false
        }
    })

    /**
     * Checking response cookie domain
     */
    Then(
        /^response (.+) cookie domain should (not )?be (.+)$/,
        function (key: string, flag: string, domain: string) {
            const cookie = world.httpApi?.getCookie(key)
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

            const cookieDomain = cookie?.domain || ''

            if (flag == undefined) {
                expect(
                    cookieDomain,
                    `Expected cookie '${key}' domain to be '${domain}', found '${cookieDomain}'`
                ).to.equal(domain)
            } else {
                expect(cookieDomain, `Cookie '${key}' domain is '${domain}'`).to.not.equal(domain)
            }
        }
    )

    /**
     * This definition can be used for checking an object response.
     * It check that the properties of this object match with the expected properties
     * The columns header are | field | matcher | value |
     * @see Assertions.assertObjectMatchSpec
     */
    Then(
        /^(?:I )?json response should (fully )?match$/,
        function (fully: string, table: DataTable) {
            const response = mustGetResponse(world.httpApi)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const body = response?.body

            // We check the response has json content-type
            expect(response?.headers['content-type']).to.contain('application/json')

            const specifications = table.hashes().map((fieldSpec) => {
                const spec = fieldSpec.expression
                    ? parseMatchExpression(fieldSpec.expression)
                    : fieldSpec
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return _.assign({}, spec, {
                    value: world.state?.populate(spec.value),
                })
            })

            assertObjectMatchSpec(body, specifications, !!fully)
        }
    )

    /**
     * This definition verify that an array for a given path has the expected length
     */
    Then(
        /^(?:I )?should receive a collection of (\d+) items?(?: for path )?(.+)?$/,
        function (size: number, path: string) {
            const response = mustGetResponse(world.httpApi)
            const body = response?.body

            const array = path != undefined ? _.get(body, path) : body

            expect(array.length).to.be.equal(Number(size))
        }
    )

    /**
     * Verifies that response matches a fixture.
     **/
    Then(/^response should match fixture (.+)$/, function (fixtureId: string) {
        const response = mustGetResponse(world.httpApi)

        return world.fixtures?.load(fixtureId).then((snapshot) => {
            expect(response?.body).to.deep.equal(snapshot)
        })
    })

    /**
     * Checking response header.
     */
    Then(
        /^response header (.+) should (not )?(equal|contain|match) (.+)$/,
        function (key: string, flag: string, comparator: string, expectedValue: string) {
            const response = mustGetResponse(world.httpApi)
            const header = response?.headers[key.toLowerCase()]

            expect(header, `Header '${key}' does not exist`).to.not.be.undefined

            let expectFn = expect(
                header,
                `Expected header '${key}' to ${
                    flag ? flag : ''
                }${comparator} '${expectedValue}', but found '${header}' which does${
                    flag ? '' : ' not'
                }`
            ).to
            if (flag != undefined) {
                expectFn = expectFn.not
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            expectFn[comparator](comparator === 'match' ? new RegExp(expectedValue) : expectedValue)
        }
    )
}
