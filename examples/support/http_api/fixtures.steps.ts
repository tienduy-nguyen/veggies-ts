import { Given } from '@cucumber/cucumber'
import nock from 'nock'

Given(/^I mock (?:(POST|GET) )?http call to forward request body for path (.+)$/, function (method,path) {
    if(method !== 'GET') {
        nock('http://fake.io')
            .post(path)
            .reply(200, (_uri, requestBody) => requestBody)
            .defaultReplyHeaders({location: 'http://fake.io/users/1'})
        return
    }

    nock('http://fake.io')
        .get(path)
        .reply(200 )
})
