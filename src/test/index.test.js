'use strict'

const server = require('node-express-server-api')
const chai = require('chai')

const client = require('../index')
const testClient = client('testclient')

let instance = null

const baseCheck = result => {
    chai.assert(!!result, 'Result Is Null!')
    chai.assert(!!result.data, 'Result Data Is Null!')
}

const healthCheck = result => {
    baseCheck(result)
    chai.assert(!!result.data.health, 'Result Data health Property Is Null!')
}

const baseResultCheck = result => {
    baseCheck(result)
    chai.assert(!!result.data.result, 'Result Data Is Null!')
}

describe('# Testing Axios Client Api', () => {
    before(() => server.map(s => (instance = s.instance)))
    after(() =>
        instance.close(() => {
            console.log('[INFO] Server Close')
        })
    )

    it('# Testing Support Ping', done => {
        try {
            testClient
                .get('/support/ping')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    baseResultCheck(result)
                    chai.assert(result.data.result == 'pong', 'Result Data Is Not Pong Value!')
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })

    it('# Testing Support Echo', done => {
        try {
            testClient
                .get('/support/echo/testing')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    baseResultCheck(result)
                    chai.assert(
                        result.data.result == 'testing',
                        'Result Data Is Not testing Value!'
                    )
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })

    it('# Testing Support Health', done => {
        try {
            testClient
                .get('/support/health')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    healthCheck(result)
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })
})
