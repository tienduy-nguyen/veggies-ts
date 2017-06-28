# veggies

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![styled with prettier][prettier-image]][prettier-url]

Veggies is an awesome cucumberjs boilerplate for API testing.
Great for testing APIs built upon Express, Koa, HAPI, Loopback and others.

- [Installation](#installation)
- [Features](#features)
    - [API testing](#api-testing)
        - [Making a simple request](#making-a-simple-request-and-testing-its-status-code)
        - [Posting data](#posting-data)
        - [Using values issued by a previous request](#using-values-issued-by-a-previous-request)
        - [Type system](#type-system)
- [Extensions](#extensions)
    - [state](#state-extension)
    - [http API](#http-api-extension)
- [Examples](#examples)    
    
## Installation

Using npm:

```sh
npm install @ekino/veggies
```

Or yarn:

```sh
yarn add @ekino/veggies
```

Then all you have to do is installing the provided extensions:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, httpApi } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        httpApi.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install({
    baseUrl: 'http://localhost:3000',
})(defineSupportCode)

```

## Features

### API testing

For an exhaustive list of all available step definitions you should have a look
at the [definitions file](https://github.com/ekino-node-staging/veggies/blob/master/src/extensions/http_api/definitions.js).

#### Making a simple request and testing its status code

```gherkin
Scenario: Using GitHub API
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then I should receive a 200 HTTP status code
```

#### Posting data

You can easily issue a POST request using json payload

```gherkin
Scenario: Creating a resource using json payload
  Given I set request json body
    | username | plouc |
    | gender   | male  |
  When I POST https://my-api.io/users
  Then I should receive a 201 HTTP status code
```

You can also use form encoded values, all you have to do is
to change `json` for `form`

```gherkin
Scenario: Creating a resource using json payload
  Given I set request form body
    | username | plouc |
    | gender   | male  |
  When I POST https://my-api.io/users
  Then I should receive a 201 HTTP status code
```

#### Using values issued by a previous request

Imagine you want to test a resource creation and then that you're able
to fetch this new entity through the API.

If resource id is generated by your API, it will be impossible to make
the second call because id is unknown. 

To solve this problem you have the ability to collect data from
a previous response, store it in the state and inject it at various
places using placeholders.

The following example calls the root GitHub API endpoint,
extracts the `emojis_url` value from the json response and
stores it in the current state under the `emojisUrl` key,
then it uses this value to make its next request.

```gherkin
Scenario: Using GitHub API
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  And I pick response json emojis_url as emojisUrl
  And I GET {{emojisUrl}}
  Then I should receive a 200 HTTP status code
```

It's even possible to mix this approach with scenario outline to have more concise tests
(at the cost of clarity thought).

The following example will generates 3 scenario at runtime
using different response values for second request.

```gherkin
Scenario Outline: Fetching <key> API endpoint from root endpoint
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then I should receive a 200 HTTP status code
  When I pick response json <key> as <key>
  And I GET {{<key>}}
  Then I should receive a 200 HTTP status code

  Examples:
    | key              |
    | emojis_url       |
    | feeds_url        |
    | public_gists_url |
```

#### Type system

When testing json based APIs, which is a standard nowadays, you have to be aware of data types
for sending payloads or making assertions on received responses, that's why veggies provides
a lightweight type systems.

The following directives are available:

| directive            | type        | example                  | output                    |
|--------------------- |------------ |------------------------- |-------------------------- |
| `((undefined))`      | `undefined` | `((undefined))`          | `undefined`               |
| `((null))`           | `null`      | `((null))`               | `null`                    |
| `<value>((string))`  | `string`    | `hi((string))`           | `'hi'`                    |
| `<value>((number))`  | `number`    | `1((number))`            | `1`                       |
| `<value>((boolean))` | `boolean`   | `true((boolean))`        | `true`                    |
| `<value>((array))`   | `Array`     | `one,two,three((array))` | `['one', 'two', 'three']` |     

You can now use those directive for most of step definitions accepting data tables.

For example you can use it to post typed json data:

```gherkin
Scenario: Creating a resource using typed json payload
  Given I set request json body
    | username  | plouc((string))          |
    | team_id   | 1((number))              |
    | is_active | true((boolean))          |
    | hobbies   | drawing,hacking((array)) |
  When I POST https://my-api.io/users
  Then I should receive a 201 HTTP status code
```

which will generate the following payload:

```json
{
  "username": "plouc",
  "team_id": 1,
  "is_active": true,
  "hobbies": [
    "drawing",
    "hacking"
  ]
}
```

## Extensions

This module is composed of several extensions.

### state extension

The state extension is a simple helper used to persist state between steps & eventually scenarios
(but you should try to avoid coupling scenarios).

It's involved for example when [you want to collect values issued by a previous request](#using-values-issued-by-a-previous-request)
when using the [http API extension](#http-api-extension).

When installed, you can access it from the global cucumber context in your own step definitions.

```javascript
defineSupportCode(({ When }) => {
    When(/^I do something useful$/, function() {
        const stateValue = this.state.get('whatever')
        // …
    })
})
```

### http API extension 

The http API extension relies on the [state extension](#state-extension),
so make sure it's registered prior to installation.

When installed, you can access it from the global cucumber context in your own step definitions.

```javascript
defineSupportCode(({ When }) => {
    When(/^I do something useful$/, function() {
        return this.httpApi.makeRequest(/* … */)
    })
})
```

## Examples

This repository comes with few examples, in order to run them, invoke the following script:

```sh
yarn run examples
```

[npm-image]: https://img.shields.io/npm/v/@ekino/veggies.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ekino/veggies
[travis-image]: https://img.shields.io/travis/ekino-node-staging/veggies.svg?style=flat-square
[travis-url]: https://travis-ci.org/ekino-node-staging/veggies
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[coverage-image]: https://img.shields.io/coveralls/ekino-node-staging/veggies/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/ekino-node-staging/veggies?branch=master
